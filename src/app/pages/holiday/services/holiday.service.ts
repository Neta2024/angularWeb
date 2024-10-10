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
  apiUrl = '/master';
  constructor(private restApi: RestApi) {
  }

   // Fetch holidays for the given year and month (default: current year, no month)
  getHolidays(year: number = new Date().getFullYear(), month: number | '' = ''): Observable<any> {
    const params: any = { year: year.toString() };
    
    if (month) {
      params.month = month.toString(); // Add month only if provided
    }

    return this.restApi.get(`${this.apiUrl}/get-holidays`, { params });
  }

  // Add a new holiday
  addHoliday(holidayRequest: any): Observable<any> {
    return this.restApi.post(`${this.apiUrl}/add-holiday`, holidayRequest);
  }

   // Update holiday
  updateHoliday(holidayRequest: any): Observable<any> {
    return this.restApi.put(`${this.apiUrl}/update-holiday`, holidayRequest);
  }

  deleteHoliday(holidayRequest: { holiday: string }): Observable<any> {
    return this.restApi.delete(`${this.apiUrl}/delete-holiday`, { body: holidayRequest });
  }
  


}
