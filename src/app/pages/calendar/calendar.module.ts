import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar.component';

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
    ])
  ],
  declarations: [CalendarComponent]
})
export class CalendarModule { }
