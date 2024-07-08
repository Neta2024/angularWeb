import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
          path: '',
          component: CalendarComponent,
      },
      {
          path: ':id',
          component: CalendarComponent,
      }
    ]),
    MatDialogModule,
    MatIconModule
  ],
  declarations: [CalendarComponent, AddEventDialogComponent]
})
export class CalendarModule { }
