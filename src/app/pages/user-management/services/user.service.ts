import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { User } from '../users/users.component';
import { RestApi } from 'src/app/shared/rest-api';


@Injectable({
    providedIn: 'root'
})

export class UserService {
    apiUrl = '/admin/users';
    constructor(private restApi: RestApi) {

    }

    private _refreshRequired = new Subject<void>();

    get RefreshRequired() {
    return this._refreshRequired;
    }

    // Using the RestApi service to get users
    getUsers(): Observable<User[]> {
        return this.restApi.get(`${this.apiUrl}/get`);
    }

    // Add a new user
    addUser(userRequest: any): Observable<any> {
        return this.restApi.post(`${this.apiUrl}/user/add`, userRequest);
    }

    // Update existing user
    updateUser(user: any): Observable<any> {
        return this.restApi.put(`${this.apiUrl}/user/update`, user);
    }
}