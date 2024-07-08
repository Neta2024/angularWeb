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
import { MatList, MatListModule } from '@angular/material/list';

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
    CommonModule,
    MatListModule
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
  suggestedTasks: { name: string }[] = [];

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
