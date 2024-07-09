import { Component, Input, ChangeDetectorRef } from '@angular/core';
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

  constructor(public modal: NgbActiveModal, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.eventDate = new Date() as Date;

    this.suggestProjects();
    this.suggestTasks();
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

    const newEvent = {
      title,
      date: this.eventDate.toISOString().slice(0, 10),
      project: this.selectedProject,
      task: this.selectedTask,
      period: this.selectedPeriod
    };

    console.log('Event Date:', this.eventDate); // Add this to check eventDate before assigning to newEvent

    this.modal.close(newEvent);
    this.cdr.detectChanges();
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
