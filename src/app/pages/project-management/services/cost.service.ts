import { Injectable } from '@angular/core';
import { RestApi } from "src/app/shared/rest-api";
import { Cost } from "../model/cost.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CostService {
  apiUrl = '/master';
    constructor(private restApi: RestApi) {
  }
  
  // Get All Project Costs
  getPjCost(request: any): Observable<Cost[]> {
    return this.restApi.post(`${this.apiUrl}/get-projectCosts`, request);
  }

  // Delete Project Cost
  delPjCost(request: { pjCostId: number }): Observable<any> {
    return this.restApi.delete(`${this.apiUrl}/delete-projectCost`, { body: request });
  }
}