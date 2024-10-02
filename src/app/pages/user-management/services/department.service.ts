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
    getUsers(): Observable<Department[]> {
        return this.restApi.get(`${this.apiUrl}/get`);
    }
}