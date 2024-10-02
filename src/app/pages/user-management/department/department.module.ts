import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentComponent } from './department.component';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [DepartmentComponent, DepartmentDialogComponent],
  imports: [
    CommonModule,
    MatTabsModule,       // Importing MatTabsModule to use mat-tab
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule, 
  ],
  exports: [
    DepartmentComponent
  ]
})
export class DepartmentModule { }
