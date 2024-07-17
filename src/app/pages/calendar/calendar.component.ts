import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput, EventContentArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { DeleteEventDialogComponent } from './delete-event-dialog/delete-event-dialog.component';
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
      // dateClick: this.handleDateClick.bind(this) ,
      dateClick: (arg) => this.handleDateClick(arg)
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
          id: timesheet.tsid,
          taskName: timesheet.taskName,
          projectName: timesheet.projectName,
          period: timesheet.period
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
      data: { date: this.clickedDate } // Pass the date as data to the dialog component
    });
    // const dialogRef = this.dialog.open(AddEventDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Event added:', result);
        console.log(typeof result.date);

        const eventDate = result.date instanceof Date ? result.date.toISOString().split('T')[0] : result.date;

        const newEvent: EventInput = {
          title: result.title,
          date: eventDate,
          color: result.color || 'blue'
        };

        console.log(newEvent);

        const payload = {
          dateList: [newEvent.date],
          projectName: result.projectName,
          taskName: result.taskName,
          period: result.period
        };

        console.log('Payload before sending:', payload);
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

  openEditEventDialog(event: EventApi): void {
    console.log('Event data to edit:', event);

    let periodValue: string;
    switch (event.extendedProps['period']) {
      case 'A':
        periodValue = '1';
        break;
      case 'M':
        periodValue = '2';
        break;
      case 'N':
        periodValue = '3';
        break;
      default:
        periodValue = event.extendedProps['period']; // fallback if no match
        break;
    }

    const eventData = {
      title: event.title,
      date: event.startStr,
      extendedProps: {
        projectName: event.extendedProps['projectName'],
        taskName: event.extendedProps['taskName'],
        period: periodValue
      }
    };
  
    console.log('Data passed to dialog:', eventData);

    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { event: eventData }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Event edited:', result);

        const periodMap: { [key: string]: string } = {
          '1': 'A', // All
          '2': 'M', // Morning
          '3': 'N'  // Afternoon
        };
  
        const updatedEvent: EventInput = {
          id: event.id, // Ensure to pass the ID of the event being edited
          title: result.title,
          date: result.date,
          color: 'blue' // Keep the color or assign a new value if needed
        };
  
        console.log(updatedEvent);
  
        const periodLetter = periodMap[result.period];

        const payload = {
          id: event.id, // Pass the ID of the event being edited
          dateList: [updatedEvent.date],
          projectName: result.projectName,
          taskName: result.taskName,
          period: periodLetter
        };
  
        console.log(payload.dateList);
        console.log(payload);
  
        this.restApi.put('/timesheets/update', payload).subscribe(response => {
          console.log('Event updated in backend:', response);
  
          // Optionally update the events array if needed
          const updatedEvents = this.events.map(e => {
            if (e.id === event.id) {
              return updatedEvent;
            } else {
              return e;
            }
          });
  
          this.events = updatedEvents;
          this.calendarOptions = {
            ...this.calendarOptions,
            events: updatedEvents
          };
  
          console.log('Updated events:', this.events);
          console.log('Updated calendar options:', this.calendarOptions);
          this.updateCalendar();
          this.cdr.detectChanges();
        }, error => {
          console.error('Error updating event in backend:', error);
        });
      }
    });
    // dialogRef.afterClosed().subscribe(updatedEvent => {
    //   if (updatedEvent) {
    //     console.log('Updated event data from dialog:', updatedEvent);
    //     // Update your calendar's event data or trigger API calls here
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     event.setProp('title', result.title);
    //     event.setStart(result.date);
    //     event.setEnd(result.date);
  
    //     event.setExtendedProp('projectName', result.projectName);
    //     event.setExtendedProp('taskName', result.taskName);
    //     event.setExtendedProp('period', result.period);
    //   }
    // });
  }

  renderEventContent(arg: EventContentArg) {
    const deleteButtonContainer = document.createElement('div');
    deleteButtonContainer.classList.add('delete-button-container');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn-delete');
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/icons/trash.png';
    deleteIcon.alt = 'Delete';
    deleteIcon.style.width = '16px'; // Adjust width as needed
    deleteIcon.style.height = '16px'; // Adjust height as needed

    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent event propagation to parent elements
      this.deleteEvent(arg.event.id);
    });
    // deleteButton.addEventListener('click', () => this.deleteEvent(arg.event.id));

    deleteButtonContainer.appendChild(deleteButton);

    //////////////////////////////////////////////////////////////////////

    const duplicateButtonContainer = document.createElement('div');
    duplicateButtonContainer.classList.add('duplicate-button-container');

    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('btn-duplicate');
    const duplicateIcon = document.createElement('img');
    duplicateIcon.src = 'assets/icons/copy.png';
    duplicateIcon.alt = 'Duplicate';
    duplicateIcon.style.width = '16px'; // Adjust width as needed
    duplicateIcon.style.height = '16px'; // Adjust height as needed

    duplicateButton.appendChild(duplicateIcon);
    duplicateButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent event propagation to parent elements
      this.duplicateEvent(arg.event);
    });
    // deleteButton.addEventListener('click', () => this.deleteEvent(arg.event.id));

    duplicateButtonContainer.appendChild(duplicateButton);

    // const duplicateButton = document.createElement('button');
    // duplicateButton.innerHTML = 'Duplicate';
    // duplicateButton.addEventListener('click', () => this.duplicateEvent(arg.event.id));

    const arrayOfDomNodes = [ 
      document.createElement('div'),
      deleteButton,
      duplicateButton
    ];

    arrayOfDomNodes[0].innerHTML = arg.event.title;

    return { domNodes: arrayOfDomNodes };
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const clickedElement = clickInfo.jsEvent.target as HTMLElement;
    
    // Check if the clicked element is the delete button
    if (clickedElement.classList.contains('btn-delete')) {
      this.deleteEvent(clickInfo.event.id);
    } else {
      this.openEditEventDialog(clickInfo.event);
    }
  }

  handleDateClick(arg: any) {
    console.log('Clicked date:', arg.dateStr);
    const clickedDate = arg.dateStr; // Get the clicked date as a string
    // Check if the clicked date already has an event
    const hasEvent = this.events.some(event => event.date === clickedDate);
    
    // if (!hasEvent) {
      this.clickedDate = clickedDate;
      console.log('Opening dialog for date:', this.clickedDate);
      this.openAddEventDialog(this.clickedDate);
    // }
  }

  duplicateEvent(event: EventApi): void {
    console.log('Event data to duplicate:', event);

    let periodValue: string;
    switch (event.extendedProps['period']) {
      case 'A':
        periodValue = '1';
        break;
      case 'M':
        periodValue = '2';
        break;
      case 'N':
        periodValue = '3';
        break;
      default:
        periodValue = event.extendedProps['period']; // fallback if no match
        break;
    }

    const eventData = {
      title: event.title,
      date: event.startStr,
      extendedProps: {
        projectName: event.extendedProps['projectName'],
        taskName: event.extendedProps['taskName'],
        period: periodValue
      }
    };

    console.log('Data passed to dialog for duplication:', eventData);

    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      data: { isDuplicate: true, event: eventData }
    });
    
    const periodMap: { [key: string]: string } = {
      '1': 'A', // All
      '2': 'M', // Morning
      '3': 'N'  // Afternoon
    };

    // --- call service for adding event here ---
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Event duplicated:', result);

      const duplicatedEvent: EventInput = {
        id: '', // New event, no ID yet
        title: result.title,
        date: result.date,
        color: 'green', // Assign a different color if needed,
        period: result.period
      };

      console.log(duplicatedEvent);

      const periodLetter = periodMap[result.period];

      const payload = {
        id: '', // New event, no ID
        dateList: [duplicatedEvent.date],
        projectName: result.projectName,
        taskName: result.taskName,
        period: result.period
      };

      console.log(payload.dateList);
      console.log(payload);

        this.restApi.post('timesheets/add', payload).subscribe(response => {
          console.log('Event created in backend:', response);

          // Optionally update the events array if needed
          this.events = [...this.events, duplicatedEvent];
          this.calendarOptions = {
            ...this.calendarOptions,
            events: this.events
          };

          console.log('Updated events:', this.events);
          console.log('Updated calendar options:', this.calendarOptions);
          this.updateCalendar();
          this.cdr.detectChanges();
        }, error => {
          console.error('Error creating event in backend:', error);
        });
      }
    })
  }

  deleteEvent(eventId: string) {
    const dialogRef = this.dialog.open(DeleteEventDialogComponent, {
      data: { eventId: [eventId] }  // Pass eventId here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.updateCalendar(); // Call method to update calendar upon successful deletion
      }
    });
  }
}
