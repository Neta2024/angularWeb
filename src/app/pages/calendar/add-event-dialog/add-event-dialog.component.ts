import { Component, Input, Inject } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestApi } from 'src/app/shared/rest-api';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent {
  @Input() date: Date;
  eventDate: Date;
  selectedProject: string;
  selectedTask: string;
  selectedPeriod: string;

  projects: any[] = [];
  tasks: any[] = [];
  suggestedProjects: { name: string }[] = [];
  // suggestedProjects: string[] = ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5'];
  suggestedTasks: { name: string }[] = [];

  isEditMode: boolean;
  event: any;

  constructor(private restApi: RestApi,
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Data received in dialog:', data);

    this.date = data.date;
    this.isEditMode = !!data.event;

    if (this.isEditMode) {
      console.log('Edit mode data:', data.event);
      this.eventDate = data.event.startStr;
      this.selectedProject = data.event.extendedProps['projectName'];
      this.selectedTask = data.event.extendedProps['taskName'];
      this.selectedPeriod = data.event.extendedProps['period'];
    }

    console.log('Processed data in dialog:', {
      eventDate: this.eventDate,
      selectedProject: this.selectedProject,
      selectedTask: this.selectedTask,
      selectedPeriod: this.selectedPeriod
    });

    this.event = data.event;
  }

  ngOnInit(): void {
    console.log('Data passed to dialog: ', this.data);
    if (this.data && this.data.date) {
      this.eventDate = new Date(this.data.date);
    } else {
      this.eventDate = new Date() as Date;
    }
    if (this.isEditMode) {
      const event = this.data.event;
      console.log('Event Data: ', event);
      this.eventDate = new Date(event.date);
      this.selectedProject = event.extendedProps.projectName;
      this.selectedTask = event.extendedProps.taskName;
      this.selectedPeriod = event.extendedProps.period;
    }
    console.log(this.eventDate);
    console.log('Received date in dialog:', this.date)
    this.fetchProjects();
    this.fetchTasks();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (!(this.eventDate instanceof Date)) {
      console.error('Error: eventDate is not a Date object.');
      return;
    }

    const period = this.getPeriodText(this.selectedPeriod);
    const title = `${this.selectedProject} - ${this.selectedTask} - ${period}`;
    const projectName = this.selectedProject;
    const taskName = this.selectedTask;
  

    const eventDateString = this.formatDate(this.eventDate);
    const id = Math.random().toString(36).substr(2, 10);

    const newEvent = {
      title,
      date: eventDateString,
      color: 'blue',
      id,
      period, 
      projectName,
      taskName
    }

    console.log('Event Date:', this.eventDate); // Add this to check eventDate before assigning to newEvent
    console.log('New Event:', newEvent);

    this.dialogRef.close(newEvent);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() is zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${day}-${month}-${year}`;
  }

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

  fetchProjects(): void {
    this.restApi.get('timesheets/project-suggestion').subscribe((response: any) => {
      this.projects = response;
    })
  }

  suggestProjects(): void {
    this.restApi.get('timesheets/project-suggestion').subscribe((response: any) => {

      console.log(response);

      this.suggestedProjects = response.map((project: any) => ({
        name: project.project_name
      }));
    });
    // this.suggestedProjects = [
    //   { name: 'Project A' },
    //   { name: 'Project B' },
    //   { name: 'Project C' },
    //   { name: 'Project D' },
    //   { name: 'Project E' }
    // ];
  }

  fetchTasks(): void {
    this.restApi.get('timesheets/task-suggestion').subscribe((response: any) => {
      this.tasks = response;
    })
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
  }

  selectTask(taskName: string) {
    this.selectedTask = taskName;
  }

  onSave(): void {
    console.log('Edit mode save action');
    this.event.title = `${this.selectedProject} - ${this.selectedTask} - ${this.getPeriodText(this.selectedPeriod)}`;
    this.event.projectName = this.selectedProject;
    this.event.taskName = this.selectedTask;
    this.event.date = this.formatDate(this.eventDate);
    this.event.period = this.selectedPeriod;
  
    this.event.extendedProps = {
      projectName: this.selectedProject,
      taskName: this.selectedTask,
      period: this.selectedPeriod
    };
    
    console.log('Event data to save:', this.event);

    this.dialogRef.close(this.event);
  }
}
