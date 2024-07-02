import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    CommonModule
  ],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent {
  eventDate: Date = new Date();
  selectedProject: string;
  selectedTask: string;
  selectedPeriod: string;

  suggestedProjects: { name: string }[] = [];
  // suggestedProjects: string[] = ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5'];
  suggestedTasks: string[] = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];

  showProjects: boolean = false;
  showTasks: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; date: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
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

    this.dialogRef.close(newEvent);
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
}
