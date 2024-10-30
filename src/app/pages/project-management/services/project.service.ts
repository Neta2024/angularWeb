import { Injectable } from '@angular/core';
import { RestApi } from "src/app/shared/rest-api";
import { Project } from "../model/project.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  apiUrl = '/master';
    constructor(private restApi: RestApi) {
  }

  // Get All Projects
  getPj(request: any): Observable<Project[]> {
    return this.restApi.post(`${this.apiUrl}/projects`, request);
  }

  // Add Project
  addPj(request: any): Observable<Project[]> {
    return this.restApi.post(`${this.apiUrl}/add-project`, request);
  }

  // Update Project
  updatePj(request: any): Observable<Project[]> {
    return this.restApi.put(`${this.apiUrl}/update-project`, request);
  }

  // Delete Project
  deletePj(request: { pjid: number }): Observable<any> {
    return this.restApi.delete(`${this.apiUrl}/delete-project`, { body: request });
  }
}