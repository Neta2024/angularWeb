import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <-- This is needed for [(ngModel)]
import { ProjectManagementComponent } from './project-management.component';

@NgModule({
  declarations: [
    ProjectManagementComponent  // Declare the component here
  ],
  imports: [
    CommonModule,
    FormsModule,  // Import FormsModule for ngModel
    RouterModule.forChild([
      {
        path: '',
        component: ProjectManagementComponent,
      },
      {
        path: ':id',
        component: ProjectManagementComponent,
      }
    ]),
  ],
  exports: [  // Export the component so it can be used in other modules if needed
    ProjectManagementComponent
  ]
})
export class ProjectManagementModule { }
