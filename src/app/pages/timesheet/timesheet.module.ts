import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetComponent } from './timesheet.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
          path: '',
          component: TimesheetComponent,
      },
      {
          path: ':id',
          component: TimesheetComponent,
      }
    ])
  ],
  declarations: [TimesheetComponent]
})
export class TimesheetModule { }
