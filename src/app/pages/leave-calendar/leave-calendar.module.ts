import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { LeaveCalendarComponent } from './leave-calendar.component';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: LeaveCalendarComponent,
      },
      {
        path: ':id',
        component: LeaveCalendarComponent,
      }
    ]),
    MaterialModule
  ],
  declarations: [
    LeaveCalendarComponent
  ]
})
export class LeaveCalendarModule { }
