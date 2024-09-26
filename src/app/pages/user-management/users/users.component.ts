import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { RestApi } from 'src/app/shared/rest-api';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  pwd: string;
  role: string;
  status: string;
  phone: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {

  // Columns to display in the table
  displayedColumns: string[] = ['fullName', 'userName',  'phone', 'status'];
  dataSource = new MatTableDataSource<User>([]); // Data source for the table

  users: any[] = [];

  searchQuery: string = '';

  isAddMode: boolean;
  isActive: boolean;

 
  constructor(private modalService: NgbModal, private restApi: RestApi, private alert: Alert) {}

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
        status: user.status === 'A' ?  this.isActive = true : false,
        role: user.role,
        phone: user.phone ? user.phone : 'no contact',
        isChanged: false, // Track if a row has changed
        isActive: user.status === 'A'
      }));   
      this.dataSource.data = this.users;
    })

  }

  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  toggleStatus(element: any) {
    this.isActive = !this.isActive;
    console.log('Status toggled for:', element);
    // You can update the element or call a service to persist the change
  }

  // Opens the Add User dialog
  openAddUserDialog(): void {
    this.isAddMode = true;
    const modalRef = this.modalService.open(UserDialogComponent, {
      size: 'lg', // You can specify the size of the modal (lg, sm, etc.)
      centered: true
    });

    // Pass data to the modal component
    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.isAddMode = this.isAddMode;

    // Handle the modal close event
    modalRef.result.then((result) => {
      if (result) {
        // Add the new user to the data source and refresh the table
        this.users.push(result);  
        this.dataSource.data = [...this.users]; // Refresh data     
        this.fetchUsers();
      }
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }


  // Opens the Edit User dialog
  openEditUserDialog(user: User): void {
    this.isAddMode = false;
    const modalRef = this.modalService.open(UserDialogComponent, {
      size: 'lg',
      centered: true
    });

    // Pass data to the modal component
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.isAddMode = this.isAddMode;
    modalRef.componentInstance.user = user;

    // Handle the modal close event
    modalRef.result.then((result) => {
      if (result) {
        // Update the user in the list and refresh the table
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index] = result;      
          this.dataSource.data = [...this.users]; // Refresh data   
          this.fetchUsers(); 
        }
      }
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }
}

