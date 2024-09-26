import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

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
    MatSlideToggleModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatRadioModule,
    MatIconModule,
  ],
  providers: [
    // Global dialog default options
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS, 
      useValue: { hasBackdrop: true, zIndex: 1000 }  // Custom options for all dialogs
    }
  ],
  exports: [UsersComponent]
})
export class UsersModule { }
