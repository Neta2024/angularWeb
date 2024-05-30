import { EventEmitter, Injectable, Output } from "@angular/core";
import { HttpClient, HttpHeaders, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { Alert } from "./components/alert/alert";

declare const serviceUrl: string;

@Injectable({ providedIn: 'root' })
export class RestApi {
  @Output() unauthorized = new EventEmitter();
  token?: string;

  constructor(private http: HttpClient, private xsrfToken: HttpXsrfTokenExtractor, private alert: Alert) { }

  get(api: string, options: any = {}): Observable<any> {
    return this.http.get(this.getUrl(api), this.createHttpOptions(options))
      .pipe(catchError(this.handleError(api, options.silent)));
  }

  post(api: string, body?: any, options: any = {}): Observable<any> {
    const isForm = body instanceof FormData;
    if ((body instanceof Object) && !isForm) {
      body = JSON.stringify(body);
    }
    return this.http.post(this.getUrl(api), body, this.createHttpOptions(options, !isForm))
      .pipe(catchError(this.handleError(api, options.silent)));
  }

  put(api: string, body?: any, options: any = {}): Observable<any> {
    const isForm = body instanceof FormData;
    if ((body instanceof Object) && !isForm) {
      body = JSON.stringify(body);
    }
    return this.http.put(this.getUrl(api), body, this.createHttpOptions(options, !isForm))
      .pipe(catchError(this.handleError(api, options.silent)));
  }

  delete(api: string, options: any = {}): Observable<any> {
    return this.http.delete(this.getUrl(api), this.createHttpOptions(options))
      .pipe(catchError(this.handleError(api, options.silent)));
  }

  private getUrl(api: string): string {
    return serviceUrl + (api.startsWith('/') ? api : `/${api}`);
  }

  private createHttpOptions(options: any, json = false): any {
    let headers: HttpHeaders = options.headers || new HttpHeaders();
    if (json && !headers.has('Content-Type')) {
      headers = headers.append('Content-Type', 'application/json;charset=utf-8');
    }
    if (this.token) {
      headers = headers.set('X-Auth-Token', this.token);
    }
    const xsrf = this.xsrfToken.getToken();
    if (xsrf) {
      headers = headers.set('X-XSRF-Token', xsrf);
    }
    options.headers = headers.set('X-Requested-With', 'XMLHttpRequest');
    options.withCredentials = true;
    //console.log(options);
    return options;
  }

  private handleError(api: string, silent?: boolean): any {
    return (e: any): Observable<any> => {
      let ex: any = { api, status: 0, message: undefined };
      if (e.error instanceof ArrayBuffer || e.error instanceof Blob) {
        const error = this.getError(e.error);
        if (error) { ex = error; }
      } else if (typeof e.error === 'string') {
        ex.message = e.error;
      } else if (e.error) {
        ex = e.error;
      }
      ex.api = api;
      ex.status = e.status;
      if (ex.status === 0) {
        ex.message = 'Unable to connect to web service';
      } else if (!ex.message) {
        ex.message = `HTTP Error ${e.status} ${e.url}`;
      }
      if (e.status === 401) {
        this.unauthorized.emit(null);
      }
      if (!silent) {
        this.alert.error(ex.message);
      }
      return throwError(() => ex)
    };
  }

  private getError(error: ArrayBuffer | Blob): any {
    const object = error instanceof Blob ? error : new Blob([error]);
    const blobUrl = window.URL.createObjectURL(object);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', blobUrl, false);
    xhr.send();
    const text = xhr.responseText;
    if (text) {
      try {
        return JSON.parse(text);
      } catch (e) { }
    }
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
  }
}
