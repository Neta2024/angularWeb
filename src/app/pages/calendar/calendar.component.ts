import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { debounceTime, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/pages/authentication/auth.service'; 
import { NgIfContext } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Alert } from 'src/app/shared/components/alert/alert';


export interface TableData {
  userProfile: string;
  projectName: string;
  task: string;
  period: string;
  date: string;
}

interface Project {
  value: string;
  viewValue: string;
}

interface ProjectGroup {
  disabled?: boolean;
  name: string;
  project: Project[];
}

interface Task {
  value: string;
  viewValue: string;
}

interface TaskGroup {
  disabled?: boolean;
  name: string;
  task: Task[];
}


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
[x: string]: any;
  public eventCreated = new EventEmitter<any>();

  // =================================================================================================
  projectControl = new FormControl();
  showProjects = false; // Flag to control Projects visibility
  projectGroups: ProjectGroup[] = [
    {
      name: 'Suggestions',
      project: []
    },
    {
      name: 'Projects',
      project: []
    },
  ];

  taskControl = new FormControl();
  showTasks = false; // Flag to control Tasks visibility
  taskGroups: TaskGroup[] = [
    {
      name: 'Suggestions',
      task: []
    },
    {
      name: 'Tasks',
      task: []
    },
  ];

 
  // =================================================================================================

  tableData: any[] = []; // Declare tableData
  displayedColumns: string[] = [];
  selectedFilterColumn: string = this.displayedColumns[0];

  // Add a ViewChild to get the reference to the input field
  @ViewChild('searchInput') searchInput: ElementRef;
  dataSource: MatTableDataSource<TableData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

 // ------------------------------------------------

  @ViewChild(MatAutocompleteTrigger) autoCompleteTrigger: MatAutocompleteTrigger;
 
  endPointHeader: string = '';
  userFullName: string = '';
  userRole: string = '';
  userControl = new FormControl();
  filteredUsers: Observable<any[]>;
  users: any[] = [];
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
  periods: string[] = ['Morning', 'Afternoon', 'All Day'];
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
  selectedUserId: number = null;
  selectedProject: string;
  selectedTask: string;
  selectedPeriod: string;  // default
  searchQuery: string = '';

  suggestedProjects: { name: string }[] = [];

  suggestedTasks: { name: string }[] = [];

  selectedDates: { date: Date }[] = [];
  eventDate: { date: Date }[] = [];

  isEditMode: boolean;
  isDuplicateMode: boolean;

  eventData: any;

  private holidayDates: Set<string> = new Set();

  // selectedView: string = 'list';
  selectedView: string = 'calendar';
  selectedTableView: string = 'individual';
  selectedCalendarView: string = 'individual';


  private userSubscription: Subscription;
  tableContent: TemplateRef<NgIfContext<boolean>>;

  constructor(
    public dialog: MatDialog,
    private restApi: RestApi,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private alert: Alert  // Inject the Alert service
  ) { 
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    this.selectedYear = currentYear;
    this.selectedMonth = new Date().getMonth();
  }


  // Pagination ----------------------------------------------------------------

  @Input() tempTotalItems: number;    // Temporary total number of items after searching
  @Input() pageSize = 50;      // Default Items per page
  @Input() pageSizeOptions = [5, 50, 100, 150, 200]; // Page size options
  pageIndex = 0;               // Current page index
  totalItems : number;
  sortField : String ='';
  sortOrder : boolean = true;   // By default sorting by username

  // Handle total items after searching by using tempTotalItems
  get totalPages(): number {
    return Math.ceil(this.tempTotalItems / this.pageSize);
  }

  // Generate and display page numbers with ellipses (...) when there are more than 10 pages
  get totalPagesArray(): (number | string)[] {
    const totalPages = this.totalPages;
    const currentPage = this.pageIndex;
    const maxPagesToShow = 10; // Show a maximum of 10 page buttons at once
    const pages: (number | string)[] = [];
  
    // If the total number of pages is less than or equal to maxPagesToShow
    if (totalPages <= maxPagesToShow) {
      return Array(totalPages).fill(0).map((_, i) => i);
    }
  
    // Calculate the start and end of the visible page range
    let startPage: number, endPage: number;
  
    if (currentPage <= 5) {
      // Near the beginning: show the first 10 pages
      startPage = 0;
      endPage = maxPagesToShow - 3;
    } else if (currentPage + 5 >= totalPages) {
      // Near the end: show the last 10 pages
      startPage = totalPages - maxPagesToShow;
      endPage = totalPages - 1;
    } else {
      // In the middle: show the current page in the center
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }
  
    // Add pages to the array, with ellipses if needed
    if (startPage > 0) {
      pages.push(0); // Always show the first page
      // pages.push('...'); // Add ellipsis if there are pages before the current range
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    if (endPage < totalPages - 1) {
      pages.push('...'); // Add ellipsis if there are pages after the current range
      pages.push(totalPages - 1); // Always show the last page
    }
  
    return pages;
  }  

  // Helper function for handling of both numbers and ellipses.
  displayPageNumber(page: number | string): string | number {
    // If it's a number, display the page number + 1 (for 1-based indexing)
    if (typeof page === 'number') {
      return page + 1;
    }
    // If it's the ellipsis, just return the string '...'
    return page;
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 0 && page < this.totalPages) {
      this.pageIndex = page;
      this.updateListView();
    }
    
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.updateListView();
    }
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.updateListView();
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.value;
    this.pageIndex = 0; // Reset to first page whenever the page size changes
    this.updateListView();
  }

  // Function triggered when sorting headers are clicked
  onSortChange(sortState: Sort) {
    const { active, direction } = sortState;
    const isAsc = direction === 'asc';

    this.sortField = active;   // Column name (e.g., 'userProfile', 'projectName', etc.)
    this.sortOrder = isAsc;    // true if ascending, false if descending

    this.updateListView();
  }

  //------------------------------------------------------------------//

  ngOnInit() {
    // check role
    const currentUser = this.authService.getAuthFromLocalStorage(); // Fetch the current user from local storage
    if (currentUser) {
      this.userFullName = currentUser.firstName + ' ' + currentUser.lastName;
      this.userRole = currentUser.role.toUpperCase();
    } else {
      this.userRole = 'No Role';
    }

    // Set displayedColumns based on the userRole
    if (this.userRole === 'USER') {
      this.displayedColumns = ['projectName', 'task', 'period', 'date'];

    } else {
      this.displayedColumns = ['userProfile', 'projectName', 'task', 'period', 'date'];
      this.fetchUsers();

      // Set up the filtered users based on user input
      this.filteredUsers = this.userControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterUsers(value || '')) // Ensure '' for clearing
        );
    }

    // Initialize the dataSource
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.initializeCalendarOptions();
    this.selectedMonth = new Date().getMonth();
    this.loadEvents(this.selectedYear, this.selectedMonth);
    this.loadTimesheets(this.selectedYear, this.selectedMonth);
    this.loadHolidays(this.selectedYear);

    
    this.fetchProjects();
    this.fetchTasks();
    this.suggestProjects();
    this.suggestTasks();
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
    // this.loadTimesheets(this.selectedYear, this.selectedMonth);
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
      userId: this.selectedUserId,
      dateList: [{}],
      projectName: '',
      taskName: '',
      period: '',
      year: year,
      month: numericMonth
    };

    const urlHeader: string = this.endPointHeader;
    const url = `${urlHeader}timesheets/get_all_timesheets/filter`;

    console.log('Selected year value:', year);
    console.log('Selected month value:', numericMonth);
    console.log("LoadEvent ", request);
    
    this.restApi.post(url, request).subscribe(response => {
      console.log(response);
      if (response) {
        this.events = response.data.map((timesheet: any) => ({
          title: `${timesheet.projectName} - ${timesheet.taskName}`,
          date: this.convertDate(timesheet.date),
          color: this.getColor(timesheet.period, timesheet.taskName),
          id: timesheet.tsid,
          taskName: timesheet.taskName,
          projectName: timesheet.projectName,
          period: timesheet.period
        }));
      } else if(response.data.length == 0) {
        this.events = [];
      }

      console.log(this.events);
    
      this.calendarOptions = {
        ...this.calendarOptions,
        events: [...this.events, ...this.holidays]
      };
    },
    (error) => {
      this.alert.error("No timesheet found");
      console.error('An error occurred:', error);
      // Clear events but keep only the holidays in calendarOptions
      this.events = [];

      // Update calendar options to include only holidays
      this.calendarOptions = {
        ...this.calendarOptions,
        events: [...this.holidays] // Only holidays are retained
      }; 
    });
  }

  loadTimesheets(year: number, month: number) {
    const page: number = this.pageIndex + 1; // Set the desired page number
    const size: number = this.pageSize; // Set the desired limit value
    const adminUser: String = this.userFullName;
    const urlHeader: string = this.endPointHeader;
    const url = `${urlHeader}timesheets/get_all_timesheets/filter?page=${page}&size=${size}&sortField=${this.sortField}&sortOrder=${this.sortOrder}`;
    console.log('url: ' + url);
    const numericMonth = month + 1;
    const request = {
      projectName: this.selectedProject || '',
      taskName: this.selectedTask || '',
      period:  this.mapPeriod(this.selectedPeriod) || '',
      year: year,
      month: numericMonth
    };
    console.log('loadtimesheets', request);
    this.restApi.post(url, request).subscribe(response => {
      if (response) {
        // Extracting pagination info
        this.totalItems = response.totalElements;
        this.tempTotalItems = this.totalItems;

        this.tableData = response.data.map((timesheet: any) => ({
          userProfile: timesheet.fullName || adminUser,
          projectName: timesheet.projectName || '',
          task: timesheet.taskName ? timesheet.taskName.replace('Leave :', '').trim() : '',
          period: this.mapPeriod(timesheet.period),
          date: this.convertDate(timesheet.date),
        }));

        // To update dataSource properly
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges(); // Trigger change detection if needed

      } else {
        this.tableData = [];
        this.dataSource.data = [];
        this.totalItems = 0;
        console.log('Data source ',this.dataSource.data.length)
      }
    }, (error) => {
      this.tempTotalItems = 0;
      this.tableData = [];
      this.dataSource.data = [];
      this.alert.error("Timesheet not found");
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
        return 'All Day';

      case 'Morning':
        return 'M';
      case 'Afternoon':
        return 'N';
      case 'All Day':
        return 'A';
      default:
        return '';
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

    if(this.selectedUserId == null){
      buttonContainer.appendChild(duplicateButton);
    }
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
  
      if(this.selectedUserId == null){
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
      
        this.updateCalendar();
  
        
        this.showEditPane({ date, period, projectName, taskName, id });
      }
      
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
    
    if(this.selectedUserId == null){
      this.selectedPeriod = '1';
      this.showDetails = true;
      this.updateCalendar();
    }
    
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

  fetchUsers(): void {
    this.restApi.get('admin/users/get').subscribe((response: any) => {
      console.log('users ', response);
      this.users = response.map((user: any) => ({
        id: user.userId,
        names: user.firstName + ' ' + user.lastName,
      })); 
    })
  }

  fetchProjects(): void {
    const payload = {};

    this.restApi.post('/master/projects', payload).subscribe((response: any) => {
      console.log('Projects', response);
      this.projects = response.map((project: any) => ({
        names: project.project_name
      }));

      // Map projects to the Project format and update projectGroups
      this.projectGroups[1].project = this.projects.map((project, index) => ({
        value: project.names,      
        viewValue: project.names        
      }));

      // console.log('Projects', this.projects)
    })
  }

  suggestProjects(): void {
    this.restApi.get('timesheets/project-suggestion').subscribe((response: any) => {

      console.log(response);

      this.suggestedProjects = response.map((project: any) => ({
        name: project.project_name
      }));

      // Map suggestedProjects to the Project format and update projectGroups
      this.projectGroups[0].project = this.suggestedProjects.map((project, index) => ({
        value: project.name,      
        viewValue: project.name        
      }));

    });
  }

  fetchTasks(): void {
    this.restApi.get('/tasks/get_all_tasks').subscribe((response: any) => {
      console.log('tasks ', response);
      this.tasks = response.map((task: any) => ({
        names: task.t_name
      }));

      // Map tasks to the Task format and update taskGroups
      this.taskGroups[1].task = this.tasks.map((task, index) => ({
        value: task.names,      
        viewValue: task.names      
      }));
    })

  }

  suggestTasks(): void {
    this.restApi.get('timesheets/task-suggestion').subscribe((response: any) => {
      
      console.log(response); 

      this.suggestedTasks = response.map((task: any) => ({
        name: task.t_name
      }));

      // Map suggestedProjects to the Project format and update projectGroups
      this.taskGroups[0].task = this.suggestedTasks.map((task, index) => ({
        value: task.name,      
        viewValue: task.name        
      }));

    });

  }

  toggleProjects() {
    this.showProjects = !this.showProjects; // Toggle visibility
  }

  toggleTasks() {
    this.showTasks = !this.showTasks; // Toggle visibility
  }

  // Handle user selection change
  onUserSelected(user: any): void {
    this.selectedUserId = user.id;
    this.onCalendarViewChange(); // Call your existing function
   
  }

  clearSelection(): void {
    this.userControl.setValue('');  // Clear the user input
    this.selectedUserId = null;     // Reset the selected user ID
  
    // Temporarily disable and re-enable the control to reset autocomplete state
    const control = this.userControl;
    control.disable();
    setTimeout(() => {
      control.enable();
      control.updateValueAndValidity();
    }, 0);
  
    // Reset filteredUsers to show all users
    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),  // Trigger the filter with an empty string to show all users
      map(value => this._filterUsers(value || '')) // Filter based on value
    );
  
    this.onCalendarViewChange();    // Call your method to handle calendar view updates
  }
  

  selectProject(projectName: string) {
    this.selectedProject = projectName;
  }

  selectTask(taskName: string) {
    this.selectedTask = taskName;
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
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
      this.alert.success('Added successfully');
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
        this.alert.success('Updated successfully');
        this.updateCalendar();
        this.cdr.detectChanges();
        
        const existingDates = new Set(this.eventData.dateList);
        const newDates = formattedDates.filter(date => !existingDates.has(date));

        // if (newDates.length > 0) {
        //   // Call addEvent() for new dates
        //   // this.addEvent(newDates);
        //   console.log("There's more than 1 date");
        //   console.log(newDates);

        //   if (newDates.length > 0) {
        //     // Prepare the payload for adding new dates
        //     const addEventPayload = {
        //       dateList: newDates,
        //       projectName,
        //       taskName,
        //       period
        //     };
    
        //     // Call addEvent() for new dates
        //     this.restApi.post('/timesheets/add', addEventPayload).subscribe(
        //       addResponse => {
        //         console.log('New dates added to backend:', addResponse);
    
        //         // Add new events to the calendar
        //         const newEvents = newDates.map(date => ({
        //           title: `${this.selectedProject} - ${this.selectedTask} - ${this.getPeriodText(this.selectedPeriod)}`,
        //           date,
        //           color: 'blue',
        //           id: Math.random().toString(36).substr(2, 10),
        //           period: this.getPeriodText(this.selectedPeriod),
        //           projectName: this.selectedProject,
        //           taskName: this.selectedTask
        //         }));
    
        //         this.events = [...this.events, ...newEvents];
        //         this.calendarOptions = {
        //           ...this.calendarOptions,
        //           events: this.events
        //         };
    
        //         console.log('Updated events with new dates:', this.events);
        //         console.log('Updated calendar options with new dates:', this.calendarOptions);
    
        //         // Refresh the calendar view
        //         this.updateCalendar();
        //         this.cdr.detectChanges();
        //       },
        //       addError => {
        //         console.error('Error adding new dates to backend:', addError);
        //       }
        //     );
        //   } else {
        //     // Refresh the calendar view if no new dates to add
        //     this.updateCalendar();
        //     this.cdr.detectChanges();
        //   }

        //   this.updateCalendar();
        //   this.cdr.detectChanges();
        // } else {
        //   // Refresh the calendar view if no new dates to add
        //   this.updateCalendar();
        //   this.cdr.detectChanges();
        // }
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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    // Define the filter predicate for userProfile column only
    this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.userProfile ? data.userProfile.toLowerCase().includes(filter) : false;
    };

    // Set the filter value
    this.dataSource.filter = filterValue;
    this.tempTotalItems = this.dataSource.filteredData.length;

    console.log('Filter ',filterValue.length);

    if(filterValue.length === 0) {
      this.tempTotalItems = this.totalItems;
    }

    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }

  resetFilters() {
    // Clear the search input field
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }

    if(this.dataSource.data.length === 0) {
      this.totalItems = 0;
    }
    this.dataSource.filter = '';
    this.selectedProject = '',
    this.selectedTask = '',
    this.selectedPeriod= '',
    this.selectedFilterColumn = '';
    this.pageIndex = 0;
    this.updateListView();
    this.totalItems = this.totalItems;
    
  }

  clearSearch() {
    this.searchQuery = ''; // Clear the input
  }

  // Method to filter users based on input value
  private _filterUsers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.names.toLowerCase().includes(filterValue));
  }

   // Display function for the mat-autocomplete input field
   displayFn(user: any): string {
    return user ? user.names : ''; // Display the user's name or empty if null
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

  onTableViewChange() {
    if (this.selectedTableView === 'all') {
      this.endPointHeader = 'admin/'
      this.updateListView();
      console.log("Admin view mode = ", this.endPointHeader)
     
    } else if (this.selectedTableView === 'individual') {
      this.endPointHeader = ''
      this.updateListView();
      console.log("Individual view mode, ", this.endPointHeader)
     
    }
  }

  onCalendarViewChange() {
    if (this.selectedUserId == null) {
      this.endPointHeader = ''
      this.updateCalendar();
      console.log("Individual view mode = ", this.endPointHeader)
     
    } else {
      this.endPointHeader = 'admin/'
      this.updateCalendar();
      console.log("Admin view mode, ", this.endPointHeader)
     
    }
  }
  
}