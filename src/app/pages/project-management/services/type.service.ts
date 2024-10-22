import { Injectable } from '@angular/core';
import { RestApi } from "src/app/shared/rest-api";
import { Type } from "../model/type.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TypeService {
  apiUrl = '/master';
    constructor(private restApi: RestApi) {
  }

  // Get All Project Types
  getPjType(request: any): Observable<Type[]> {
    return this.restApi.post(`${this.apiUrl}/project-types`, request);
  }

  // Add Project Type
  addPjType(request: any): Observable<Type[]> {
    return this.restApi.post(`${this.apiUrl}/add-project-type`, request);
  }

  // Update Project Type
  updPjType(request: any): Observable<Type[]> {
    return this.restApi.put(`${this.apiUrl}/update-project-type`, request);
  }

  // Delete Project Type
  delPjType(request: { pj_type_id: number }): Observable<any> {
    return this.restApi.delete(`${this.apiUrl}/delete-project-type`, { body: request });
  }
}