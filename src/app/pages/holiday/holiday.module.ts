// holiday.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { HolidayComponent } from './holiday.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HolidayDialogComponent } from './holiday-dialog/holiday-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    HolidayComponent, HolidayDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FormsModule, 
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    RouterModule.forChild([
      {
        path: '',
        component: HolidayComponent,
      },
      {
        path: ':id',
        component: HolidayComponent,
      }
    ]),
    MaterialModule
  ],
  
  exports: [
    HolidayComponent
  ]
})
export class HolidayModule { }
