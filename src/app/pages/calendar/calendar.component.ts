import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

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
  
  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) { 
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear; i++) {
      this.years.push(i);
    }
    this.selectedYear = currentYear;
    this.selectedMonth = new Date().getMonth();
  }

  ngOnInit() {
    this.initializeCalendarOptions();
    this.loadEvents();
  }

  initializeCalendarOptions() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      initialDate: new Date(this.selectedYear, this.selectedMonth, 1),
      events: this.events,
      eventContent: this.renderEventContent.bind(this)
    }
  }

  loadEvents() {
    this.events = [
      { title: 'Event 1', date: '2024-07-25', color: 'blue' },
      { title: 'Event 2', date: '2024-07-28', color: 'green' },
      { title: 'Event 3', date: '2024-07-20', color: 'red' },
      { title: 'Event 4', date: '2024-07-26', color: 'orange'},
      { title: 'Event 5', date: '2024-07-21', color: 'purple'},
      { title: 'Event 6', date: '2024-07-21', color: 'orange'},
      { title: 'Event 7', date: '2024-07-21', color: 'green'}
    ];
  
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.events
    };
  }

  updateCalendar() {
    this.calendarVisible = false;
    setTimeout(() => {
      this.calendarOptions = {
        ...this.calendarOptions,
        initialDate: new Date(this.selectedYear, this.selectedMonth, 1)
      };
      this.calendarVisible = true;
    })
  }

  openAddEventDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Event added:', result);

        const newEvent: EventInput = {
          title: result.title,
          date: result.date,
          color: 'blue' // Default color if not provided
        };

        this.events = [...this.events, newEvent];
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.events]
        // Handle the new event data
        };
        
        console.log('Updated events:', this.events);
        console.log('Updated calendar options:', this.calendarOptions);
        this.updateCalendar();
      }
    });
  }

  renderEventContent(arg: EventContentArg) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<mat-icon>delete</mat-icon>';
    deleteButton.addEventListener('click', () => this.deleteEvent(arg.event.id));

    const duplicateButton = document.createElement('button');
    duplicateButton.innerHTML = 'Duplicate';

    const arrayOfDomNodes = [ 
      document.createElement('div'),
      deleteButton,
      duplicateButton
    ];

    arrayOfDomNodes[0].innerHTML = arg.event.title;

    return { domNodes: arrayOfDomNodes };
  }

  deleteEvent(eventId: string) {
    this.events = this.events.filter(event => event.id !== eventId);
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.events],
    };
    this.updateCalendar();
    this.cdr.detectChanges();
    console.log('Event deleted. Updated events:', this.events);
  }
}
