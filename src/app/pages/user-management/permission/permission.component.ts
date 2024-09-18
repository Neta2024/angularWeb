// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-permission',
//   standalone: true,
//   imports: [],
//   templateUrl: './permission.component.html',
//   styleUrl: './permission.component.scss'
// })
// export class PermissionComponent {

// }

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RestApi } from 'src/app/shared/rest-api';

@Component({
  selector: 'app-permission',  // Check the selector here
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  // Define roles for the dropdown
  roles: string[] = ['ADMIN', 'USER'];

  users: any[] = [];

  // Data source for the table
  dataSource = new MatTableDataSource<UserPermission>([]);

  // Columns displayed in the table
  displayedColumns: string[] = ['user', 'fullName', 'role'];

  // Example data to display
  userPermissions: UserPermission[] = [];

  constructor(private restApi: RestApi,) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.dataSource.data = this.userPermissions;
  }

  fetchUsers(){
    this.restApi.get('/users/get').subscribe((response: any) => {
      console.log('users ', response);
      this.users = response.map((user: any ) => ({
        id: user.userId,
        userName: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role.toUpperCase()
      })); 
      this.dataSource.data = this.users;
    })
  }

  onSave(): void {
    console.log('Updated Data:', this.dataSource.data); // Handle saving data
  }

  onCancel(): void {
    // this.dataSource.data = [...this.users]; // Reset data
    this.fetchUsers(); // Fetch updated data from server
  }
}

export interface UserPermission {
  no: number;
  user: string;
  fullName: string;
  role: string;
}
