import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { TypeComponent } from './type.component';
import { TypeDialogComponent } from './type-dialog/type-dialog.component';

@NgModule({
  declarations: [
    TypeComponent,
    TypeDialogComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
  ],
  exports: [
    TypeComponent,
  ],
})

export class TypeModule {}