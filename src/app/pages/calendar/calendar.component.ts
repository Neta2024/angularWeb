import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput, EventContentArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { DeleteEventDialogComponent } from './delete-event-dialog/delete-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RestApi } from 'src/app/shared/rest-api';
import interactiionPlugin from '@fullcalendar/interaction';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EventEmitter } from '@angular/core';
import { start } from '@popperjs/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/pages/authentication/auth.service'; 
import { NgIfContext } from '@angular/common';


export interface TableData {
  userProfile: string;
  projectName: string;
  task: string;
  period: string;
  date: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  public eventCreated = new EventEmitter<any>();

  tableData: any[] = []; // Declare tableData
  displayedColumns: string[] = [];
  selectedFilterColumn: string = this.displayedColumns[0];
  dataSource: MatTableDataSource<TableData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  projects: any[] = [];
  tasks: any[] = [];

  filters = {
    userProfile: '',
    projectName: '',
    taskName: '',
    period: '',
    date: ''
  };
  userProfiles: string; // Populate this with your user profiles
  projectName: string[] = []; // Populate this with your project name
  taskName: string[] =   []; // Populate this with your task name
  periods: string[] = ['Morning', 'Afternoon', 'All Days'];
  dates: string[] = []; // Populate this with available dates


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
  holidays: any[] = [];
  
  showDetails = false;
  
  selectedProject: string;
  selectedTask: string;
  selectedPeriod: string;

  suggestedProjects: { name: string }[] = [];
  suggestedTasks: { name: string }[] = [];

  selectedDates: { date: Date }[] = [];
  eventDate: { date: Date }[] = [];

  isEditMode: boolean;
  isDuplicateMode: boolean;

  eventData: any;

  private holidayDates: Set<string> = new Set();

  selectedView: string = 'list';

  userRole: string = '';

  private userSubscription: Subscription;
tableContent: TemplateRef<NgIfContext<boolean>>;

  constructor(
    public dialog: MatDialog,
    private restApi: RestApi,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { 
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    this.selectedYear = currentYear;
    this.selectedMonth = new Date().getMonth();
  }

  ngOnInit() {
    // check role
    const currentUser = this.authService.getAuthFromLocalStorage(); // Fetch the current user from local storage
    if (currentUser) {
      this.userRole = currentUser.role.toUpperCase();
    } else {
      this.userRole = 'No Role';
    }

    // Set displayedColumns based on the userRole
    if (this.userRole === 'USER') {
      this.displayedColumns = ['projectName', 'task', 'period', 'date'];
    } else {
      this.displayedColumns = ['userProfile', 'projectName', 'task', 'period', 'date'];
    }

    // Initialize the dataSource
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.initializeCalendarOptions();

    console.log('Initial selected year:', this.selectedYear); // Debugging log
    console.log('Initial selected month:', this.selectedMonth);

    this.selectedMonth = new Date().getMonth();

    console.log('Initial selected year:', this.selectedYear); // Debugging log
    console.log('Initial selected month:', this.selectedMonth);

    this.loadEvents(this.selectedYear, this.selectedMonth);
    this.loadTimesheets(this.selectedYear, this.selectedMonth);
    this.loadHolidays(this.selectedYear);

    this.fetchProjects();
    this.fetchTasks();
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
    // Logic to handle view change
    if (this.selectedView === 'calendar') {
      // Switch to calendar view
    } else if (this.selectedView === 'list') {
      // Switch to list view
    }
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
      dateClick: (arg) => this.handleDateClick(arg),
      datesSet: this.onDatesSet.bind(this),
      headerToolbar: {
        start: '',
        center: '',
        end: 'today prev,next'
      }
    }
  }

  onDatesSet(arg: any) {
    const calendarDate = arg.view.currentStart;
    console.log('calendarDate: ',calendarDate);
    this.selectedYear = calendarDate.getFullYear();
    console.log('this.selectedYear = ',this.selectedYear)
    console.log('type: ',typeof this.selectedYear)
    this.selectedMonth = calendarDate.getMonth();
    // this.selectedMonth = parseInt(this.selectedMonth.toString(), 10);
    console.log('this.selectedMonth = ',this.selectedMonth)
    console.log('type: ',typeof this.selectedMonth)
    this.cdr.detectChanges();
    this.loadEvents(this.selectedYear, this.selectedMonth);
    this.loadTimesheets(this.selectedYear, this.selectedMonth);
  }

  getColor(period: string, taskName: string): string {
    const colors: { [key: string]: string } = {
      'A': '#ccebff',
      'M': '#d6f5d6',
      'N': '#ffebcc'
    };

    const isLeave = taskName.toLowerCase().includes('leave');
  
    if (isLeave) {
      return '#f0e6ff';
    }
    
    return colors[period] || 'grey';
  }

  getTextColor(period: string): string {
    const colors: { [key: string]: string } = {
      'A': '#005c99',
      'M': '#1e7b1e',
      'N': '#995c00'
    };
    return colors[period] || '#e60000';
  }

  convertDate(dateString: string): string {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  loadEvents(year: number, month: number) {
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

    console.log('Selected year value:', year);
    console.log('Selected month value:', numericMonth);
    console.log(request);
    
    this.restApi.post('timesheets/get_all_timesheets/filter', request).subscribe(response => {
      console.log(response);
      if (response) {
        this.events = response.map((timesheet: any) => ({
          title: `${timesheet.projectName} - ${timesheet.taskName}`,
          date: this.convertDate(timesheet.date),
          color: this.getColor(timesheet.period, timesheet.taskName),
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
        events: [...this.events, ...this.holidays]
      };
    },
    (error) => {
      console.error('An error occurred:', error);
    });
  }

  loadTimesheets(year: number, month: number) {
    const numericMonth = month + 1;
    const request = {
      // dateList: this.filters.date ? [this.filters.date] : [{}],
      projectName: this.selectedProject || '',
      taskName: this.selectedTask || '',
      period: this.filters.period || '',
      year: year,
      month: numericMonth
    };
console.log('loadtimesheets', request);
    this.restApi.post('timesheets/get_all_timesheets/filter', request).subscribe(response => {
      if (response) {
        this.tableData = response.map((timesheet: any) => ({
          userProfile: timesheet.fullName || 'Personal Profile',
          projectName: timesheet.projectName || '',
          task: timesheet.taskName ? timesheet.taskName.replace('Leave :', '').trim() : '',
          period: this.mapPeriod(timesheet.period),
          date: this.convertDate(timesheet.date),
        }));

        // Ensure that dataSource is updated properly
        this.dataSource.data = this.tableData;
        console.log('Timesheets', response)
        this.cdr.detectChanges(); // Trigger change detection if needed
      } else {
        this.tableData = [];
        this.dataSource.data = [];
      }
    }, (error) => {
      this.tableData = [];
      this.dataSource.data = [];
      console.error('An error occurred:', error);
    });
  }
  
  // Helper function to map period codes
  mapPeriod(period: string): string {
    switch (period) {
      case 'M':
        return 'Morning';
      case 'N':
        return 'Afternoon';
      case 'A':
        return 'All Days';
      default:
        return 'Unknown';
    }
  }
  

  loadHolidays(year: number): void {
    console.log('Selected year:', year);
  
    // Make the API call
    this.restApi.get(`/master/get-holidays`, { params: { year: year.toString() } }).subscribe(
      response => {
        console.log('Holidays response:', response);
  
        if (response) {
          this.holidays = response.map((holiday: any) => ({
            title: holiday.holidayName,
            date: this.convertDate(holiday.holiday),
            color: '#ffe6e6', // You can use a different color or logic if needed
            id: this.generateUniqueId(holiday),
            holidayName: holiday.holidayName
          }));
        } else {
          this.holidays = [];
        }
  
        console.log('Holidays:', this.holidays);
  
        this.holidayDates.clear();
        response.forEach((holiday: any) => {
          this.holidayDates.add(this.convertDate(holiday.holiday));
        });

        // Combine events and holidays if needed
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.events, ...this.holidays]
        };
  
        console.log(this.calendarOptions.events);

        this.updateCalendar();
        this.cdr.detectChanges();
      },
      error => {
        console.error('An error occurred while loading holidays:', error);
      }
    );
  }

  isHoliday(date: string): boolean {
    return this.holidayDates.has(date);
  }

  generateUniqueId(holiday: any): string {
    return `${holiday.holiday}-${holiday.holidayName}-${Date.now()}`;
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

  updateListView() {
    this.selectedMonth = parseInt(this.selectedMonth.toString(), 10);
    this.loadTimesheets(this.selectedYear, this.selectedMonth);
    this.fetchProjects();
    this.fetchTasks();
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
          console.log('Full error response: ', error);
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


  private formatDateforHoliday(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() is zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  renderEventContent(arg: EventContentArg) {
    const eventDate = this.formatDateforHoliday(arg.event.start);
    const timesheetDetial = document.createElement('div');
    // const leaveType = arg.event.extendedProps['leaveType'];
    const period = arg.event.extendedProps['period'];

    // Use getTextColor to set the text color
    const textColor = this.getTextColor(period);

    // Use getColor to set the container background color
    // const bgColor = this.getColor(period, leaveType);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.paddingBottom = '5px';
    buttonContainer.classList.add('button-container');

    if (!this.isHoliday(eventDate)) {
    const deleteButtonContainer = document.createElement('div');
    deleteButtonContainer.classList.add('delete-button-container');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn-delete');
    deleteButton.style.border = 'none';
    deleteButton.style.background = 'none';
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

    buttonContainer.appendChild(deleteButton);

    //////////////////////////////////////////////////////////////////////

    const duplicateButtonContainer = document.createElement('div');
    duplicateButtonContainer.classList.add('duplicate-button-container');

    const duplicateButton = document.createElement('button');
    duplicateButton.classList.add('btn-duplicate');
    duplicateButton.style.border = 'none';
    duplicateButton.style.background = 'none';
    const duplicateIcon = document.createElement('img');
    duplicateIcon.src = 'assets/icons/copy.png';
    duplicateIcon.alt = 'Duplicate';
    duplicateIcon.style.width = '16px'; // Adjust width as needed
    duplicateIcon.style.height = '16px'; // Adjust height as needed

    duplicateButton.appendChild(duplicateIcon);
    duplicateButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent event propagation to parent elements

      console.log('Event Object:', arg.event);

      const eventDef = arg.event._def; // Contains general event definitions
      const extendedProps = arg.event.extendedProps; 
      
      const { title, publicId } = eventDef; 
      const { range } = arg.event._instance;
      const startDate = range?.start; // Example, adjust if necessary
      const endDate = range?.end; // Example, adjust if necessary
      
      const formattedDates = this.selectedDates.length > 0 ? 
        this.selectedDates.map(d => this.formatDate(startDate)) :
        [this.formatDate(startDate)];
      // const formattedDates = this.selectedDates.map(d => this.formatDate(startDate));
      console.log(formattedDates);

      const period = extendedProps?.['period'] || ''; // Set default value if period is not available
      const projectName = extendedProps?.['projectName'] || '';
      const taskName = extendedProps?.['taskName'] || '';
      // const taskName = extendedProps?.taskName || '';

      const eventData = {
        date: startDate || '', // Ensure default value if undefined
        period: period || '', // If period is not available, set a default or compute it
        projectName: projectName || '', // Ensure default value if undefined
        taskName: taskName || '', // If taskName is not available, set a default or compute it
        id: publicId || 0 // Ensure default value if undefined
      };
    
      console.log('Event Data to be Sent:', eventData);
      this.showDuplicatePane(eventData);

      
    });
    // deleteButton.addEventListener('click', () => this.deleteEvent(arg.event.id));

    buttonContainer.appendChild(duplicateButton);
  }

    
    // Style the timesheetDetial element
    timesheetDetial.style.padding = '3px';
    timesheetDetial.style.color = textColor;
    timesheetDetial.style.fontWeight = 'bold';
    timesheetDetial.style.whiteSpace = 'normal'; // Allow text to wrap
    timesheetDetial.style.overflow = 'hidden'; // Prevent overflow
    timesheetDetial.style.maxWidth = '150px'; // Set maximum width (adjust as needed)
    timesheetDetial.style.wordWrap = 'break-word'; // Break long words if needed
    const arrayOfDomNodes = [ 
      timesheetDetial,
      buttonContainer
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
      const eventDef = clickInfo.event._def;
      const eventInstance = clickInfo.event._instance;

      console.log('Extended Props:', eventDef.extendedProps);
      
      // Extract details from the event
      const date = eventInstance.range.start.toISOString().split('T')[0]; // Format date
      const period = eventDef.extendedProps['period'] || ''; // Adjust based on actual structure
      const projectName = eventDef.title.split(' - ')[0] || ''; // Extract project name from title
      const taskName = eventDef.title.split(' - ')[1] || ''; // Extract task name from title
      const id = eventDef.publicId || ''; // Use publicId or another unique identifier

      // Log extracted details for debugging
      console.log('Extracted details:', { date, period, projectName, taskName, id });
      this.isEditMode = true;
      this.showDetails = true;
      // Call editEvent with the extracted details
      // this.editEvent({ date, period, projectName, taskName, id });
      // this.editEvent(clickInfo.event);
      // console.log('clickInfo:', clickInfo);
      // console.log('EventImpl details:', clickInfo.event);
      this.updateCalendar();

      this.showEditPane({ date, period, projectName, taskName, id });
    }
  }

  handleDateClick(arg: any) {
    console.log('Clicked date:', arg.dateStr);

    const date = new Date(arg.dateStr);

    const dateExists = this.selectedDates.some(d => 
      d.date.getFullYear() === date.getFullYear() &&
      d.date.getMonth() === date.getMonth() &&
      d.date.getDate() === date.getDate()
    );
    // const dateExists = this.selectedDates.some(d => d.date === date);

    if (!dateExists) {
      this.selectedDates.push({ date: date });
    } else {
      console.log('Date already selected:', date);
    }

    console.log(this.eventDate);

    console.log(this.selectedDates);
    this.showDetails = true;
    // const clickedDate = arg.dateStr; // Get the clicked date as a string
    // // Check if the clicked date already has an event
    // const hasEvent = this.events.some(event => event.date === clickedDate);
    
    // // if (!hasEvent) {
    //   this.clickedDate = clickedDate;
    //   console.log('Opening dialog for date:', this.clickedDate);
    //   this.openAddEventDialog(this.clickedDate);
    // // }
    this.updateCalendar();
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

  /////// ========================


  fetchProjects(): void {
    const payload = {
    
    };

    this.restApi.post('/master/projects', payload).subscribe((response: any) => {
      console.log(response);
      this.projects = response.map((project: any) => ({
        names: project.project_name
      }));
      console.log('Projects', this.projects)
    })
  }

  suggestProjects(): void {
    this.restApi.get('timesheets/project-suggestion').subscribe((response: any) => {

      console.log(response);

      this.suggestedProjects = response.map((project: any) => ({
        name: project.project_name
      }));
    });
  }

  fetchTasks(): void {
    this.restApi.get('/tasks/get_all_tasks').subscribe((response: any) => {
      console.log(response);
      this.tasks = response;

    })
    // this.restApi.get('timesheets/task-suggestion').subscribe((response: any) => {
    //   this.tasks = response;
    // })
  }

  suggestTasks(): void {
    this.restApi.get('timesheets/task-suggestion').subscribe((response: any) => {
      
      console.log(response); 

      this.suggestedTasks = response.map((task: any) => ({
        name: task.t_name
      }))
    });
    // this.suggestedTasks = [
    //   { name: 'Task A' },
    //   { name: 'Task B' },
    //   { name: 'Task C' },
    //   { name: 'Task D' },
    //   { name: 'Task E' }
    // ];
  }

  selectProject(projectName: string) {
    this.selectedProject = projectName;
    this.filters.projectName = projectName;
  }

  selectTask(taskName: string) {
    this.selectedTask = taskName;
  }

  closeDetailsPane() {
    this.showDetails = false; // Hide details pane
    this.updateCalendar();
    this.selectedDates = [];
    this.selectedProject = '';
    this.selectedTask = '';
    this.selectedPeriod = '';
    this.isDuplicateMode = false;
    this.isEditMode = false;
  }

  removeDate(index: number): void {
    this.selectedDates.splice(index, 1);
  }
  ///////// =========================-

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
  
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() is zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${day}-${month}-${year}`;
  }
  
  addEvent(): void {
    if (this.selectedDates.length === 0) {
      console.error('Error: No dates selected.');
      return;
    }

    console.log(this.selectedDates);

    const formattedDates = this.selectedDates.map(d => this.formatDate(d.date));
    console.log(formattedDates);

    const period = this.getPeriodText(this.selectedPeriod);
    const title = `${this.selectedProject} - ${this.selectedTask} - ${period}`;
    const projectName = this.selectedProject;
    const taskName = this.selectedTask;
    const id = Math.random().toString(36).substr(2, 10);

    const payload = {
      dateList: formattedDates,
      projectName,
      taskName,
      period
    };

    console.log(payload);
    this.restApi.post('/timesheets/add', payload).subscribe(response => {
      console.log('Event added to backend:', response);

      const newEvents = formattedDates.map(date => ({
        title: `${this.selectedProject} - ${this.selectedTask} - ${this.getPeriodText(this.selectedPeriod)}`,
        date,
        color: 'blue',
        id,
        period: this.getPeriodText(this.selectedPeriod),
        projectName: this.selectedProject,
        taskName: this.selectedTask
      }));

      this.events = [...this.events, newEvents];
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
      this.showDetails = false; // Hide details pane
      this.updateCalendar();
    });

    this.showDetails = false;
    this.selectedDates = [];
    this.selectedProject = '';
    this.selectedTask = '';
    this.selectedPeriod = '';
    this.isDuplicateMode = false;
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
  
  showEditPane(event: any): void {
    if (!event || !event.date) {
      console.error('Error: No event or date provided.');
      return;
    }

    const periodToNumber = this.convertPeriodToNumber(event.period);

    const newDate = new Date(event.date);
  
    // Add the new date to selectedDates if it doesn't already exist
    const dateExists = this.selectedDates.some(d =>
      d.date.getFullYear() === newDate.getFullYear() &&
      d.date.getMonth() === newDate.getMonth() &&
      d.date.getDate() === newDate.getDate()
    );

    if (!dateExists) {
      this.selectedDates.push({ date: newDate });
    } else {
      console.log('Date already selected:', newDate);
    }
    
    // Set up selected dates and other fields from the event parameter
    // this.selectedDates = [{ date: new Date(event.date) }];
    this.selectedPeriod = periodToNumber;
    // this.selectedPeriod = event.period || ''; // Assuming `event` has a `period` property
    // this.selectedProject = event.projectName; // Assuming `event` has a `projectName` property
    // this.selectedTask = event.taskName; // Assuming `event` has a `taskName` property
    
    this.selectedPeriod = this.selectedPeriod !== undefined ? this.selectedPeriod : periodToNumber;
    this.selectedProject = this.selectedProject || event.projectName;
    this.selectedTask = this.selectedTask || event.taskName;

    console.log('Selected Period:', this.selectedPeriod);
    console.log(this.selectedDates);

    const formattedDates = this.selectedDates.map(d => this.formatDate(d.date));
    console.log(formattedDates);

    this.eventData = event;
  }

  editEvent(): void {
    if (!this.eventData) {
      console.error('Error: No event data available.');
      return;
    }

    console.log("Edit action");

    console.log("eventData:", this.eventData);
    console.log(this.selectedDates);

    const formattedDates = this.selectedDates.map(d => this.formatDate(d.date));
    console.log(formattedDates);

    const period = this.getPeriodText(this.selectedPeriod);
    const title = `${this.selectedProject} - ${this.selectedTask} - ${period}`;
    const projectName = this.selectedProject;
    const taskName = this.selectedTask;
    const id = this.eventData.id;

    const payload = {
      id,
      dateList: formattedDates,
      projectName,
      taskName,
      period
    };
    console.log(payload);

    this.restApi.put('/timesheets/update', payload).subscribe(
      response => {
        console.log('Event updated to backend:', response);

        const updatedEvent = response; // Adjust if necessary based on actual response structure

        this.events = this.events.map(e => e.id === this.eventData.id ? updatedEvent : e);
        
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.events
        };

        console.log('Updated events:', this.events);
        console.log('Updated calendar options:', this.calendarOptions);

        const existingDates = new Set(this.eventData.dateList);
        const newDates = formattedDates.filter(date => !existingDates.has(date));

        if (newDates.length > 0) {
          // Call addEvent() for new dates
          // this.addEvent(newDates);
          console.log("There's more than 1 date");
          console.log(newDates);

          if (newDates.length > 0) {
            // Prepare the payload for adding new dates
            const addEventPayload = {
              dateList: newDates,
              projectName,
              taskName,
              period
            };
    
            // Call addEvent() for new dates
            this.restApi.post('/timesheets/add', addEventPayload).subscribe(
              addResponse => {
                console.log('New dates added to backend:', addResponse);
    
                // Add new events to the calendar
                const newEvents = newDates.map(date => ({
                  title: `${this.selectedProject} - ${this.selectedTask} - ${this.getPeriodText(this.selectedPeriod)}`,
                  date,
                  color: 'blue',
                  id: Math.random().toString(36).substr(2, 10),
                  period: this.getPeriodText(this.selectedPeriod),
                  projectName: this.selectedProject,
                  taskName: this.selectedTask
                }));
    
                this.events = [...this.events, ...newEvents];
                this.calendarOptions = {
                  ...this.calendarOptions,
                  events: this.events
                };
    
                console.log('Updated events with new dates:', this.events);
                console.log('Updated calendar options with new dates:', this.calendarOptions);
    
                // Refresh the calendar view
                this.updateCalendar();
                this.cdr.detectChanges();
              },
              addError => {
                console.error('Error adding new dates to backend:', addError);
              }
            );
          } else {
            // Refresh the calendar view if no new dates to add
            this.updateCalendar();
            this.cdr.detectChanges();
          }

          this.updateCalendar();
          this.cdr.detectChanges();
        } else {
          // Refresh the calendar view if no new dates to add
          this.updateCalendar();
          this.cdr.detectChanges();
        }
        // // Refresh the calendar view
        // this.updateCalendar();

        // // Manually trigger change detection
        // this.cdr.detectChanges();
      },
      error => {
        console.error('Error Response:', error);
        this.showDetails = false; // Hide details pane
        this.updateCalendar();
      }
    );

    this.showDetails = false;
    this.selectedDates = [];
    this.selectedProject = '';
    this.selectedTask = '';
    this.selectedPeriod = '';
    this.isEditMode = false;
  }

  // showEditPane(event: any): void {
  //   if (!event || !event.date) {
  //     console.error('Error: No event or date provided.');
  //     return;
  //   }

  //   const periodToNumber = this.convertPeriodToNumber(event.period);

  //   // Set up selected dates and other fields from the event parameter
  //   this.selectedDates = [{ date: new Date(event.date) }];
  //   this.selectedPeriod = periodToNumber;
  //   // this.selectedPeriod = event.period || ''; // Assuming `event` has a `period` property
  //   this.selectedProject = event.projectName; // Assuming `event` has a `projectName` property
  //   this.selectedTask = event.taskName; // Assuming `event` has a `taskName` property
    
  //   console.log('Selected Period:', this.selectedPeriod);

  //   console.log(this.selectedDates);

  //   const formattedDates = this.selectedDates.map(d => this.formatDate(d.date));
  //   console.log(formattedDates);

  //   this.eventData = event;
  // }

  showDuplicatePane(event: any): void {
    if (!event || !event.date) {
      console.error('Error: No event or date provided.');
      return;
    }

    console.log(event);

    this.isDuplicateMode = true;
    this.showDetails = true;
    
    this.updateCalendar();

    const periodToNumber = this.convertPeriodToNumber(event.period);

    // Set up selected dates and other fields from the event parameter
    this.selectedDates = [{ date: new Date(event.date) }];
    this.selectedPeriod = periodToNumber;
    // this.selectedPeriod = event.period || ''; // Assuming `event` has a `period` property
    this.selectedProject = event.projectName; // Assuming `event` has a `projectName` property
    this.selectedTask = event.taskName; // Assuming `event` has a `taskName` property
    
    console.log('Selected Period:', this.selectedPeriod);

    console.log(this.selectedDates);

    const formattedDates = this.selectedDates.map(d => this.formatDate(d.date));
    console.log(formattedDates);

    this.eventData = event;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onYearMonthChange() {
    if (this.selectedView === 'list') {
      this.updateListView();
    } else {
      this.updateCalendar();
    }
  }
  
  onViewChange() {
    if (this.selectedView === 'list') {
      this.updateListView();
    } else {
      // Handle other view change logic here if needed
      this.updateCalendar();
    }
  }
  
}