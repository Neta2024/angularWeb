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
  suggestedTasks: string[] = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];

  showProjects: boolean = false;
  showTasks: boolean = false;

  constructor(public modal: NgbActiveModal) {}

  onCancel(): void {
    
  }

  onAdd(): void {
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

    //this.dialogRef.close(newEvent);
  }

  // formatDate(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero based
  //   const day = ('0' + date.getDate()).slice(-2);
  //   return `${year}-${month}-${day}`;
  // }

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
  //////////

  // showSuggestedProjects() {
  //   this.showProjects = !this.showProjects;
  //   this.showTasks = false; // Hide tasks list if shown
  // }

  suggestProjects(): void {
    this.suggestedProjects = [
      { name: 'Project 1' },
      { name: 'Project 2' },
      { name: 'Project 3' },
      { name: 'Project 4' },
      { name: 'Project 5' }
    ];
  }

  selectProject(project: string) {
    this.selectedProject = project;
    this.showProjects = false; // Hide projects list after selection
  }

  add() {
    throw new Error('Method not implemented.');
  }
}
