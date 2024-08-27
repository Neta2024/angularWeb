// holiday.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { HolidayComponent } from './holiday.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
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
  declarations: [
   
  ]
})
export class HolidayModule { }
