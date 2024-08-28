import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog } from '@angular/material/dialog';
import { RestApi } from 'src/app/shared/rest-api';
import interactiionPlugin from '@fullcalendar/interaction';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EventEmitter } from '@angular/core';
import { start } from '@popperjs/core';
import { LeaveEntry, LeaveDetail } from './model/leave-calendar.model'; // Adjust the path based on your file structure


@Component({
  selector: 'app-leave-calendar',
  templateUrl: './leave-calendar.component.html',
  styleUrl: './leave-calendar.component.scss'
})
export class LeaveCalendarComponent implements OnInit{
  public eventCreated = new EventEmitter<any>();

  clickedDate: string;
  calendarOptions: CalendarOptions;
  calendarVisible = true;
  years: number[] = [];
  months: { name: string, value: number }[] = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 },
  ];
  selectedYear: number;
  selectedMonth: number;
  leaveCalendar: any[] = [];
  
  showDetails = false;
  
  selectedProject: string;
  selectedTask: string;
  selectedPeriod: string;

  projects: any[] = [];
  tasks: any[] = [];

  selectedDates: { date: Date }[] = [];
  eventDate: { date: Date }[] = [];

  isEditMode: boolean;
  isDuplicateMode: boolean;

  eventData: any;

  private leaveDate: Set<string> = new Set();

  selectedView: string = 'calendar';

  constructor(
    public dialog: MatDialog,
    private restApi: RestApi,
    private cdr: ChangeDetectorRef
  ) {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    this.selectedYear = currentYear;
    this.selectedMonth = new Date().getMonth();
  }
  

  ngOnInit() {
    this.initializeCalendarOptions();
    // console.log('Initial selected year:', this.selectedYear);
    // console.log('Initial selected month:', this.selectedMonth);
    this.loadLeaveCalendar(this.selectedYear, this.selectedMonth);  // Updated call
  }

  ngOnDestroy() {
    this.saveState();
  }

  saveState() {
    localStorage.setItem('calendarDate', JSON.stringify({ year: this.selectedYear, month: this.selectedMonth }));
  }

  restoreState() {
    const savedDate = localStorage.getItem('calendarDate');

    if (savedDate) {
      const { year, month } = JSON.parse(savedDate);
      this.selectedYear = year;
      this.selectedMonth = month;
    }
  }

  updateView() {
    if (this.selectedView === 'calendar') {
    } else if (this.selectedView === 'list') {
    }
  }
  
  initializeCalendarOptions() {
    this.calendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactiionPlugin],
        initialDate: new Date(this.selectedYear, this.selectedMonth, 1),
        eventContent: this.renderEventContent.bind(this),
        datesSet: this.onDatesSet.bind(this),
        headerToolbar: {
            start: '',
            center: '',
            end: 'today prev,next'
        }
    };
  }

  onDatesSet(arg: any) {
    const calendarDate = arg.view.currentStart;
    // console.log('calendarDate: ',calendarDate);
    this.selectedYear = calendarDate.getFullYear();
    // console.log('this.selectedYear = ',this.selectedYear)
    // console.log('type: ',typeof this.selectedYear)
    this.selectedMonth = calendarDate.getMonth();
    // console.log('this.selectedMonth = ',this.selectedMonth)
    // console.log('type: ',typeof this.selectedMonth)
    this.loadLeaveCalendar(this.selectedYear, this.selectedMonth);
  }

  getColor(period: string, taskName: string): string {
    const colors: { [key: string]: string } = {
      'A': '#b3e0ff',
      'M': '#98e698',
      'N': 'orange'
    };

    const isLeave = taskName.toLowerCase().includes('leave');
  
    if (isLeave) {
      return 'purple';
    }
    
    return colors[period] || 'grey';
  }

  convertDate(dateString: string): string {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }
  
  loadLeaveCalendar(year: number, month: number): void {
    const numericMonth = this.selectedMonth + 1;
    // console.log('Selected year and month:', year, numericMonth);

    // Make the API call with year and month
    this.restApi.get(`/leave-calendar/get`, { 
        params: { 
            year: year.toString(), 
            month: numericMonth  // Adjust month to be 1-based if required by the API
        } 
    }).subscribe(
        (response: any) => {
            // console.log('API Response:', response); // Log the entire response
            const leaveData: LeaveEntry[] = response as LeaveEntry[];

            // console.log('Leave details response:', leaveData);

            // Clear previous leave calendar
            this.leaveCalendar = [];
            this.leaveDate.clear();

            if (Array.isArray(leaveData)) {
                leaveData.forEach((item: LeaveEntry) => {
                    const date = this.convertDate(item.date); // Convert date to the appropriate format
                    this.leaveDate.add(date);

                    // Process each leave detail
                    for (const [employeeName, leaveArray] of Object.entries(item.leaveDetails)) {
                        leaveArray.forEach((leave: LeaveDetail) => {
                            this.leaveCalendar.push({
                                title: `${employeeName}: ${leave.leaveType}`,
                                date: date,
                                color: this.getColor(leave.period, leave.leaveType), // Use getColor method here
                                id: this.generateUniqueId({ date, employeeName, leaveType: leave.leaveType }),
                                extendedProps: {
                                    employeeName: employeeName,
                                    leaveType: leave.leaveType,
                                    period: leave.period,
                                }
                            });
                        });
                    }
                });
            } else {
                console.warn('Expected array but received:', leaveData);
            }

            // Combine events and holidays
            this.calendarOptions = {
                ...this.calendarOptions,
                events: [...this.leaveCalendar]
            };

            // console.log('Updated Calendar Events:', this.calendarOptions.events);

            this.updateCalendar();
            this.cdr.detectChanges();

        },
        error => {
            console.error('An error occurred while loading holidays:', error);
        }
    );
}

  isLeaveDay(date: string): boolean {
    return this.leaveDate.has(date);
  }

  generateUniqueId(holiday: any): string {
    return `${holiday.holiday}-${holiday.holidayName}-${Date.now()}`;
  }

  updateCalendar() {
    this.selectedMonth = parseInt(this.selectedMonth.toString(), 10);
    // console.log('Updated selectedMonth:', this.selectedMonth);

    // this.loadLeaveCalendar(this.selectedYear, this.selectedMonth);
    // this.loadEvents(this.selectedYear, this.selectedMonth);

    this.calendarVisible = false;
    setTimeout(() => {
        this.calendarOptions = {
            ...this.calendarOptions,
            initialDate: new Date(this.selectedYear, this.selectedMonth, 1)
        };
        this.calendarVisible = true;
    });
  }

  renderEventContent(arg: EventContentArg) {
    const employeeName = arg.event.extendedProps['employeeName'];
    const leaveType = arg.event.extendedProps['leaveType'];
    const container = document.createElement('div');
    container.style.padding = '5px';
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `<strong>${employeeName}</strong> <br> <strong>${leaveType}</strong>`;
    titleDiv.style.color = 'black';
    container.appendChild(titleDiv);
    return { domNodes: [container] };
  }


  handleDateClick(arg: any) {
    // console.log('Clicked date:', arg.dateStr);
    const date = new Date(arg.dateStr);
    const dateExists = this.selectedDates.some(d => 
      d.date.getFullYear() === date.getFullYear() &&
      d.date.getMonth() === date.getMonth() &&
      d.date.getDate() === date.getDate()
    );

    if (!dateExists) {
      this.selectedDates.push({ date: date });
    } else {
      console.log('Date already selected:', date);
    }

    this.showDetails = true;
    this.updateCalendar();
  }

  /////////////////////
  getPeriodText(period: string): string {
    switch (period) {
      case '1':
        return 'A';
      case '2':
        return 'M';
      case '3':
        return 'N';
      default:
        return '';
    }
  }

  convertPeriodToNumber(period: string): string {
    switch (period) {
      case 'A':
        return '1';
      case 'M':
        return '2';
      case 'N':
        return '3';
      default:
        return '';
    }
  }
}
