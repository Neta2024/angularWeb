import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestApi } from 'src/app/shared/rest-api';


export interface Holiday {
  name: string;
  date: string; // Format: 'YYYY-MM-DD'
  description?: string;
}

@Injectable({
  providedIn: 'root'
})

export class HolidayService {
  private apiUrl = 'https://dev-ginkgorun.ginkgosoft.co.th/api/master/get-holidays';

  constructor(private http: HttpClient) { }

  // getHolidays(year: number): Observable<any> {
  //   return this.http.get<any[]>(`${this.apiUrl}?year=${year}`);
  // }

}
