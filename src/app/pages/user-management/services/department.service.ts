import { Injectable } from "@angular/core";
import { RestApi } from "src/app/shared/rest-api";
import { Department } from "../model/department.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DepartmentService {
    apiUrl = '/master/department';
    constructor(private restApi: RestApi) {
    }

    // Using the RestApi service to get users
    getDepartments(requestDep: any): Observable<Department[]> {
        return this.restApi.post(`${this.apiUrl}/get`, requestDep);
    }

    // Add a new department
    addDepartment(requestDep: any): Observable<Department[]> {
        return this.restApi.post(`${this.apiUrl}/add`, requestDep);
    }

    // Update department
    updateDepartment(requestDep: any): Observable<Department[]> {
        return this.restApi.put(`${this.apiUrl}/update`, requestDep);
    }

     // Update department
     deleteDepartment(requestDep: { emp_dep_id: number }): Observable<any> {
        // Pass the department ID as part of the request body
        return this.restApi.delete(`${this.apiUrl}/delete`, { body: requestDep });
    }
    
}