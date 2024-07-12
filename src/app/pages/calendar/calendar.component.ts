import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RestApi } from 'src/app/shared/rest-api';
import interactiionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
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
  events: EventInput[] = [];
  
  constructor(
    public dialog: MatDialog,
    private restApi: RestApi,
    private cdr: ChangeDetectorRef
  ) { 
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear; i++) {
      this.years.push(i);
    }
    this.selectedYear = currentYear;
    this.selectedMonth = new Date().getMonth();
  }

  ngOnInit() {
    this.initializeCalendarOptions();

    console.log('Initial selected year:', this.selectedYear); // Debugging log
    console.log('Initial selected month:', this.selectedMonth);

    this.selectedMonth = new Date().getMonth();

    console.log('Initial selected year:', this.selectedYear); // Debugging log
    console.log('Initial selected month:', this.selectedMonth);

    this.loadEvents(this.selectedYear, this.selectedMonth);
  }

  initializeCalendarOptions() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactiionPlugin],
      initialDate: new Date(this.selectedYear, this.selectedMonth, 1),
      events: this.events,
      eventClick: this.handleEventClick.bind(this),
      eventContent: this.renderEventContent.bind(this),
      dateClick: this.handleDateClick.bind(this) 
    }
  }

  getColor(projectName: string): string {
    const colors: { [key: string]: string } = {
      'Project Alpha': 'blue',
      'Project Beta': 'green',
      'DMS on Cloud-Alfresco': 'orange'
    };

    return colors[projectName] || 'grey';
  }

  convertDate(dateString: string): string {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  loadEvents(year: number, month: number) {
    console.log('Selected month type:', typeof this.selectedMonth);
    console.log('Selected month value:', this.selectedMonth);

    const numericMonth = this.selectedMonth + 1;
    const request = {
      id: 0,
      dateList: [{}],
      projectName: '',
      taskName: '',
      period: '',
      year: year,
      month: numericMonth
    };

    console.log(typeof month);

    console.log(request);
    
    this.restApi.post('timesheets/get_all_timesheets/filter', request).subscribe(response => {
      console.log(response);
      if (response) {
        this.events = response.map((timesheet: any) => ({
          title: `${timesheet.projectName} - ${timesheet.taskName}`,
          date: this.convertDate(timesheet.date),
          color: this.getColor(timesheet.projectName),
          id: timesheet.tsid
        }));
      } else {
        this.events = [];
      }

      console.log(this.events);
    
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events
      };
    },
    (error) => {
      console.error('An error occurred:', error);
    });
  }

  updateCalendar() {
    this.selectedMonth = parseInt(this.selectedMonth.toString(), 10);

    this.loadEvents(this.selectedYear, this.selectedMonth);

    this.calendarVisible = false;
    setTimeout(() => {
      this.calendarOptions = {
        ...this.calendarOptions,
        initialDate: new Date(this.selectedYear, this.selectedMonth, 1)
      };
      this.calendarVisible = true;
    })
  }

  openAddEventDialog(date: string = null): void {
    if (!date) {
      this.clickedDate = new Date().toISOString().split('T')[0]; // Set clickedDate to today's date if date is null
    } else {
      this.clickedDate = date; // Set clickedDate to the date passed from cell click
    }
    
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { date } // Pass the date as data to the dialog component
    });
    // const dialogRef = this.dialog.open(AddEventDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Event added:', result);

        const newEvent: EventInput = {
          title: result.title,
          date: result.date,
          color: result.color || 'blue'
        };

        console.log(newEvent);

        const payload = {
          dateList: [newEvent.date],
          projectName: result.projectName,
          taskName: result.taskName,
          period: result.period
        };

        console.log(payload.dateList);
        console.log(payload);
        this.restApi.post('/timesheets/add', payload).subscribe(response => {
          console.log('Event added to backend:', response);

          this.events = [...this.events, newEvent];
          this.calendarOptions = {
            ...this.calendarOptions,
            events: [...this.events]
          };

          console.log('Updated events:', this.events);
          console.log('Updated calendar options:', this.calendarOptions);
          this.updateCalendar();
          this.cdr.detectChanges();
        }, error => {
          console.error('Error adding event to backend:', error);
        });

        this.events = [...this.events, newEvent];
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.events]
        // Handle the new event data
        };
        
        console.log('Updated events:', this.events);
        console.log('Updated calendar options:', this.calendarOptions);
        this.updateCalendar();
        this.cdr.detectChanges();
      }
    });
  }

  renderEventContent(arg: EventContentArg) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<mat-icon>delete</mat-icon>';
    deleteButton.classList.add('btn-delete');
    deleteButton.addEventListener('click', () => this.deleteEvent(arg.event.id));

    const duplicateButton = document.createElement('button');
    duplicateButton.innerHTML = 'Duplicate';
    duplicateButton.addEventListener('click', () => this.duplicateEvent(arg.event.id));

    const arrayOfDomNodes = [ 
      document.createElement('div'),
      deleteButton,
      duplicateButton
    ];

    arrayOfDomNodes[0].innerHTML = arg.event.title;

    return { domNodes: arrayOfDomNodes };
  }

  handleEventClick(arg: any): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: {
        event: arg.event
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Event edited:', result);

        const editedEventIndex = this.events.findIndex(event => event.id === result.id);
        if (editedEventIndex !== -1) {
          this.events[editedEventIndex] = result;
        }

        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.events]
        };

        console.log('Updated events:', this.events);
        console.log('Updated calendar options:', this.calendarOptions);
        this.updateCalendar();
        this.cdr.detectChanges();
      }
    });
  }

  // handleDateClick(arg: any) {
  //   alert('date click! ' + arg.dateStr)
  // }
  handleDateClick(arg: any) {
    console.log('Clicked date:', arg.dateStr);
    const clickedDate = arg.dateStr; // Get the clicked date as a string
    // Check if the clicked date already has an event
    const hasEvent = this.events.some(event => event.date === clickedDate);
    
    if (!hasEvent) {
      this.clickedDate = clickedDate;
      console.log('Opening dialog for date:', this.clickedDate);
      this.openAddEventDialog(this.clickedDate);
    }
  }

  duplicateEvent(event: string): any {
    console.log(event);
  }

  deleteEvent(eventId: string) {
    console.log(eventId);

    this.restApi.delete(`/timesheets/delete/${eventId}`).subscribe(
      () => {
        console.log('Event deleted successfully from the backend.');
  
        // Remove the event from the local events array
        this.events = this.events.filter(event => event.id !== eventId);

        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.events],
        };

        this.updateCalendar();
      },
      error => {
        console.error('Error deleting event from the backend:', error);
      }

  //   this.events = this.events.filter(event => event.id !== eventId);
  //   this.calendarOptions = {
  //     ...this.calendarOptions,
  //     events: [...this.events],
  //   };
  //   this.updateCalendar();
  //   this.cdr.detectChanges();
  //   console.log('Event deleted. Updated events:', this.events);
  // }
    );
  }
}
