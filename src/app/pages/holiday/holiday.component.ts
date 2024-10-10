import { Component, OnInit } from '@angular/core';
import { HolidayService } from './services/holiday.service';
import { RestApi } from 'src/app/shared/rest-api';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Alert } from 'src/app/shared/components/alert/alert';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HolidayDialogComponent } from './holiday-dialog/holiday-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../authentication/auth.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-holiday',
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
  selectedMonth: number | '' = ''; 
  selectedYear: number;
  availableYears: number[] = [];
  isAddMode: boolean;
  userRole: string = '';

  constructor(
    private authService: AuthService,
    private holidayService: HolidayService,
    private alert: Alert,
    private modalService: NgbModal, 
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
     // check role
     const currentUser = this.authService.getAuthFromLocalStorage(); 
     if (currentUser) {
       this.userRole = currentUser.role.toUpperCase();
     } else {
       this.userRole = 'No Role';
     }

    this.initializeYears();
    this.selectedYear = new Date().getFullYear(); 
    this.getHolidays(this.selectedYear, this.selectedMonth);
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.availableYears.push(currentYear - i);
    }
  }


  getHolidays(year: number, month: number | ''): void {
    this.holidayService.getHolidays(year, month).subscribe(
      (response: any[]) => {
        console.log('Holidays response:', response);

        if (response) {
          this.holidays = response.map((holiday: any) => ({
            date:  holiday.holiday,
            name: holiday.holidayName
          }));

          // Organize holidays by month using manual date parsing
        this.holidaysByMonth = this.monthsWithNumbers.reduce((acc, month) => {
          acc[month.name] = this.holidays.filter(holiday => {
            const [day, monthStr, year] = holiday.date.split('-'); // Split DD-MM-YYYY
            const holidayDate = new Date(Number(year), Number(monthStr) - 1, Number(day)); // Create Date object
            return holidayDate.getMonth() + 1 === month.number;
          });
          return acc;
        }, {} as { [key: string]: any[] });
      } else {
        this.holidays = [];
      }
      console.log('Holidays by Month:', this.holidaysByMonth);
      }
    );
  }

  convertToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  formatDateToDDMMYYYY(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date; 
    const day = String(d.getDate()).padStart(2, '0'); 
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear(); 
    return `${day}-${month}-${year}`; // Return formatted date
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

  addHoliday(holidayRequest: any) {
    // Call Service API
    this.holidayService.addHoliday(holidayRequest).subscribe(
      (response) => {
        this.alert.success('Department added successfully');
        this.getHolidays(this.selectedYear, this.selectedMonth);
      },
      (error) => {
        this.alert.error(error.message);
      }
    );

  }

  updateHoliday(holidayRequest: any) {
    this.holidayService.updateHoliday(holidayRequest).subscribe(
      (response) => {
        this.alert.success('Department updated successfully');
        this.getHolidays(this.selectedYear, this.selectedMonth);
      },
      (error) => {
        this.alert.error(error.message);
      }
    )

  }

  deleteHoliday(holidayDate: Date) {
     // Open confirmation dialog
     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '315px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure to delete this holiday?'
      }
    });

    // Handle the dialog result
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const dateObject = new Date(holidayDate); // Convert to Date if necessary
        console.log(dateObject);
        const formattedDate = this.formatDateToDDMMYYYY(dateObject); // Format to DD-MM-YYYY
      
        // Call the service method with the correct property name
        this.holidayService.deleteHoliday({ holiday: formattedDate }).subscribe(
          (response) => {
            this.alert.success('Holiday deleted successfully'); // Message adjustment
            this.getHolidays(this.selectedYear, this.selectedMonth);
          },
          (error) => {
            this.alert.error(error.message);
          }
        );
      }
    });

    
  }
  

  openHolidayDialog(): void{
    this.isAddMode = true;
    const modalRef = this.modalService.open(HolidayDialogComponent, {
      size: 'lg', // You can specify the size of the modal (lg, sm, etc.)
      centered: true
    });

    // Pass data to the modal component
    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.isAddMode = this.isAddMode;

    // Handle the modal close event
    modalRef.result.then((result) => {
      if (result) {
        this.addHoliday(result);     
        console.log('Result from dialog',result);
      }
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }


  openEditHoliday(holiday: any): void {
    this.isAddMode = false;
    const modalRef = this.modalService.open(HolidayDialogComponent, {
      size: 'lg',
      centered: true
    });
  
    // Pass data to the modal component
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.isAddMode = this.isAddMode;
    modalRef.componentInstance.holiday = holiday; // Pass the selected holiday data
  
    // Handle the modal close event
    modalRef.result.then((result) => {
      if (result) {
        // Update the user in the list and refresh the table
        const index = this.holidays.findIndex(u => u.id === holiday.id);
        if (index !== -1) {
          // this.holidays[index] = result; // Update the list with edited values
          this.updateHoliday(result);
        }
      }
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }
  

  
}