import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { RestApi } from 'src/app/shared/rest-api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-pane',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatListModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './event-pane.component.html',
  styleUrl: './event-pane.component.scss'
})
export class EventPaneComponent {
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
  isDuplicateMode: boolean;
  event: any;

  constructor(private restApi: RestApi,
    public dialogRef: MatDialogRef<EventPaneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Data received in dialog:', data);

    this.date = data.date;
    this.isDuplicateMode = data.isDuplicate === true;
    this.isEditMode = data.event && !data.isDuplicate;

    if (this.isEditMode) {
      console.log('Edit mode data:', data.event);
      this.eventDate = data.event.startStr;
      this.selectedProject = data.event.extendedProps['projectName'];
      this.selectedTask = data.event.extendedProps['taskName'];
      this.selectedPeriod = data.event.extendedProps['period'];
    }

    if (this.isDuplicateMode) {
      console.log('Duplicate mode data:', data);
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

  suggestProjects(): void {
    this.restApi.get('timesheets/project-suggestion').subscribe((response: any) => {

      console.log(response);

      this.suggestedProjects = response.map((project: any) => ({
        name: project.project_name
      }));
    });
  }

}
