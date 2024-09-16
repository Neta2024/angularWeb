import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  imports: [
    MatAutocompleteModule,
    MatInputModule,
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
    MaterialModule
  ],
  declarations: [CalendarComponent, AddEventDialogComponent]
})
export class CalendarModule { }
