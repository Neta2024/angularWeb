import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [UsersComponent, UserDialogComponent],
  imports: [
    CommonModule,
    MatTabsModule,       // Importing MatTabsModule to use mat-tab
    MatTableModule,      // Other Angular Material modules you need
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule, // Add MatDialogModule here
    FormsModule,  // Import FormsModule here
  ],
  exports: [UsersComponent]
})
export class UsersModule { }
