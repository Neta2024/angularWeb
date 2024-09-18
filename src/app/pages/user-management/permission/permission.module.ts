import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionComponent } from './permission.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [ PermissionComponent],
  imports: [
    CommonModule,
    MatTabsModule,       // Importing MatTabsModule to use mat-tab
    MatTableModule,      // Other Angular Material modules you need
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ], 
  exports: [
    PermissionComponent 
  ]
})
export class PermissionModule { }
