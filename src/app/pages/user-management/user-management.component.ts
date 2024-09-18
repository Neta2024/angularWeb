import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

// Interface for user permission data
export interface UserPermission {
  no: number;
  user: string;
  fullName: string;
  role: string;
}

@Component({
  selector: 'app-user-management',
  // standalone: true,
  // imports :[],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {

}
