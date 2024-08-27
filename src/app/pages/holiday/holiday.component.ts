import { Component, OnInit } from '@angular/core';
import { HolidayService } from '../services/holiday.service';
import { RestApi } from 'src/app/shared/rest-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-holiday',
  standalone: true,
  imports :[CommonModule],
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss'],
})
export class HolidayComponent implements OnInit {
  holidays: any[] = [];
  holidaysByMonth: { [key: string]: any[] } = {};
  monthsWithNumbers = [
    { name: 'January', number: 1 },
    { name: 'February', number: 2 },
    { name: 'March', number: 3 },
    { name: 'April', number: 4 },
    { name: 'May', number: 5 },
    { name: 'June', number: 6 },
    { name: 'July', number: 7 },
    { name: 'August', number: 8 },
    { name: 'September', number: 9 },
    { name: 'October', number: 10 },
    { name: 'November', number: 11 },
    { name: 'December', number: 12 },
  ];
  selectedMonth: number | '' = ''; // Default to empty string for optional month
  selectedYear: number;
  availableYears: number[] = [];

  constructor(
    private holidayService: HolidayService,
    private restApi: RestApi,
  ) {}

  ngOnInit(): void {
    this.initializeYears();
    this.selectedYear = new Date().getFullYear();  // Set the current year as the default selected year
    this.getHolidays(this.selectedYear, this.selectedMonth);
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  getHolidays(year: number, month: number | ''): void {
    // Convert month to a string if it's not empty
    const monthParam = month ? month.toString: '';

    this.restApi.get('/master/get-holidays', { params: { year: year.toString(), month: monthParam } }).subscribe(
      (response: any[]) => {
        console.log('Holidays response:', response);

        if (response) {
          this.holidays = response.map((holiday: any) => ({
            title: holiday.holidayName,
            date: this.convertDate(holiday.holiday),
            name: holiday.holidayName
          }));

          // Organize holidays by month
          this.holidaysByMonth = this.monthsWithNumbers.reduce((acc, month) => {
            acc[month.name] = this.holidays.filter(holiday =>
              new Date(holiday.date).getMonth() + 1 === month.number
            );
            return acc;
          }, {} as { [key: string]: any[] });
        } else {
          this.holidays = [];
        }

        console.log('Holidays:', this.holidays);
      }
    );
  }

  convertDate(dateString: string): string {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  getDaySuffix(day: string): string {
    const dayNumber = parseInt(day, 10);
    if (dayNumber > 3 && dayNumber < 21) return 'th'; // All teens have 'th'
    switch (dayNumber % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
  

  isHolidayInMonth(holiday: any, month: string): boolean {
    return new Date(holiday.date).toLocaleString('default', { month: 'long' }) === month;
  }

  onYearChange(event: Event): void {
    const year = (event.target as HTMLSelectElement).value;
    this.selectedYear = +year;
    this.getHolidays(this.selectedYear, this.selectedMonth);
    console.log(this.selectedYear);
  }

  onMonthChange(event: Event): void {
    this.selectedMonth = +(event.target as HTMLSelectElement).value;
    this.getHolidays(this.selectedYear, this.selectedMonth);
    console.log(this.selectedMonth);
  }
}