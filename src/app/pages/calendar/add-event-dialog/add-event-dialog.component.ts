import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  suggestedProjects: { name: string }[] = [];
  // suggestedProjects: string[] = ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5'];
  suggestedTasks: { name: string }[] = [];

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    this.eventDate = new Date() as Date;
  }

  onCancel(): void {
    this.modal.dismiss();
  }

  onAdd(): void {
    if (!(this.eventDate instanceof Date)) {
      console.error('Error: eventDate is not a Date object.');
      return;
    }

    const periodText = this.getPeriodText(this.selectedPeriod);
    const title = `${this.selectedProject} - ${this.selectedTask} - ${periodText}`;

    const eventDateString = this.formatDate(this.eventDate);
    const id = Math.random().toString(36).substr(2, 10);

    const newEvent = {
      title,
      date: eventDateString,
      color: 'blue',
      id
    }

    console.log('Event Date:', this.eventDate); // Add this to check eventDate before assigning to newEvent
    console.log('New Event:', newEvent);

    this.modal.close(newEvent);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() is zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getPeriodText(period: string): string {
    switch (period) {
      case '1':
        return 'All';
      case '2':
        return 'Morning';
      case '3':
        return 'Afternoon';
      default:
        return '';
    }
  }

  suggestProjects(): void {
    this.suggestedProjects = [
      { name: 'Project A' },
      { name: 'Project B' },
      { name: 'Project C' },
      { name: 'Project D' },
      { name: 'Project E' }
    ];
  }

  suggestTasks(): void {
    this.suggestedTasks = [
      { name: 'Task A' },
      { name: 'Task B' },
      { name: 'Task C' },
      { name: 'Task D' },
      { name: 'Task E' }
    ];
  }

  selectProject(projectName: string) {
    this.selectedProject = projectName;
  }

  selectTask(taskName: string) {
    this.selectedTask = taskName;
  }
}
