import { Injectable } from '@angular/core';
import { RestApi } from "src/app/shared/rest-api";
import { Status } from "../model/status.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class StatusService {
  apiUrl = '/master';
    constructor(private restApi: RestApi) {
  }

  // Get All Project Statuses
  getPjStatus(request: any): Observable<Status[]> {
    return this.restApi.post(`${this.apiUrl}/get-projectStatus`, request);
  }

  // Add Project Status
  addPjStatus(request: any): Observable<Status[]> {
    return this.restApi.post(`${this.apiUrl}/add-projectStatus`, request);
  }

  // Update Project Status
  updPjStatus(request: any): Observable<Status[]> {
    return this.restApi.put(`${this.apiUrl}/update-projectStatus`, request);
  }

  // Delete Project Status
  delPjStatus(request: { pj_s_id: number }): Observable<any> {
    return this.restApi.delete(`${this.apiUrl}/delete-project-status`, { body: request });
  }
}