import { Component, Input } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef } from '@angular/material/dialog';
import { RestApi } from 'src/app/shared/rest-api';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent {
  @Input() date: Date;
  eventDate: Date = new Date();
  selectedProject: string;
  selectedTask: string;
  selectedPeriod: string;

  projects: any[] = [];
  tasks: any[] = [];
  suggestedProjects: { name: string }[] = [];
  // suggestedProjects: string[] = ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5'];
  suggestedTasks: { name: string }[] = [];

  constructor(private restApi: RestApi, public dialogRef: MatDialogRef<AddEventDialogComponent>) {}

  ngOnInit(): void {
    this.eventDate = new Date() as Date;
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
}
