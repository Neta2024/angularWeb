import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { RestApi } from 'src/app/shared/rest-api';
import { Alert } from 'src/app/shared/components/alert/alert';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  role: string;
  status: string;
  phone: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  encapsulation: ViewEncapsulation.None // Disable view encapsulation
})
export class UsersComponent implements OnInit {

  // Columns to display in the table
  displayedColumns: string[] = ['fullName', 'userName',  'status', 'phone'];
  dataSource = new MatTableDataSource<User>([]); // Data source for the table

  users: any[] = [];

  searchQuery: string = '';

  constructor(private dialog: MatDialog, private restApi: RestApi, private alert: Alert) {}

  ngOnInit(): void {
    this.fetchUsers();
    // Initialize the data source with the list of users
    this.dataSource.data = this.users;
  }

  fetchUsers(){
    this.restApi.get('admin/users/get').subscribe((response: any) => {
      console.log(response);
      this.users = response.map((user: any ) => ({
        id: user.userId,
        userName: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        status: user.status === 'A' ? 'active' : 'inactive',
        role: user.role,
        phone: user.phone ? user.phone : 'no contact',
        isChanged: false // Track if a row has changed
      })); 
      this.dataSource.data = this.users;
    })
  }

  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  toggleStatus(element: any) {
    // Handle status toggle here
    console.log('Status toggled for:', element);
    // You can update the element or call a service to persist the change
  }

  // Opens the Add User dialog
  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      disableClose: true,
      autoFocus: true,
      width: '500px',
      data: { mode: 'add' } // Pass mode as 'add' to distinguish between add/edit
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add the new user to the data source and refresh the table
        this.users.push(result);
        this.dataSource.data = [...this.users]; // Refresh data
      }
    });
  }

  // Opens the Edit User dialog
  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { mode: 'edit', user } // Pass mode as 'edit' and the selected user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the user in the list and refresh the table
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index] = result;
          this.dataSource.data = [...this.users]; // Refresh data
        }
      }
    });
  }
}

