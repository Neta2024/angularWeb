import { Injectable } from '@angular/core';
import { RestApi } from "src/app/shared/rest-api";
import { Type } from "../model/type.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TypeService {
  apiUrl = '/master/project-types';
    constructor(private restApi: RestApi) {
  }

  getPjType(request: any): Observable<Type[]> {
    return this.restApi.post(`${this.apiUrl}`, request);
  }
}
