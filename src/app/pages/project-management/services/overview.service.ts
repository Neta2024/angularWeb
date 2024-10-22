import { Injectable } from '@angular/core';
import { RestApi } from "src/app/shared/rest-api";
import { Overview } from "../model/overview.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class OverviewService {
  apiUrl = '/master';
    constructor(private restApi: RestApi) {
  }

  // Get All Projects
  getOverview(request: any): Observable<Overview[]> {
    return this.restApi.post(`${this.apiUrl}/projects`, request);
  }

  // Delete Project
  delOverview(request: { pjid: number }): Observable<any> {
    return this.restApi.delete(`${this.apiUrl}/delete-project`, { body: request });
  }
}