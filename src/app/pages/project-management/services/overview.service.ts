import { Injectable } from '@angular/core';
import { RestApi } from "src/app/shared/rest-api";
import { Overview } from "../model/overview.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class OverviewService {
  apiUrl = '/master/projects';
    constructor(private restApi: RestApi) {
  }

  getOverview(request: any): Observable<Overview[]> {
    return this.restApi.post(`${this.apiUrl}`, request);
  }
}
