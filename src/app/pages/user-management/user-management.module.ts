import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { PermissionComponent } from './permission/permission.component';
import { PermissionModule } from './permission/permission.module';



@NgModule({
  imports: [
    CommonModule,
    PermissionModule, // Import PermissionModule
    MatTabsModule,
    FormsModule,
    SharedModule,
    MatTabsModule,       // Importing Angular Material Tabs
    MatTableModule,      // For material table
    MatFormFieldModule,  // For form field (dropdown)
    MatSelectModule,     // For select dropdown
    MatButtonModule  ,    // For Material buttons
    RouterModule.forChild([
      {
        path: '',
        component: UserManagementComponent,
      },
      {
        path: ':id',
        component: UserManagementComponent,
      }
    ]),
    MaterialModule
  ],
  declarations: [  
    UserManagementComponent,
    
  ]
})
export class UserManagementModule { }
