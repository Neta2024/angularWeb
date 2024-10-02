import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { RestApi } from 'src/app/shared/rest-api';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {

  // Columns to display in the table
  displayedColumns: string[] = [
    'fullName', 
    'userName',  
    'phone', 
    'status',  
    'role', 
    'emp_dep_code',
    'lockedOut', 
    'creator',
    'createdDate', 
    'updateDate', 
    'lastLoginDate',  
    'failureCount'];
  dataSource = new MatTableDataSource<User>([]); // Data source for the table

  users: any[] = [];

  searchQuery: string = '';

  isAddMode: boolean;

  constructor(
    private service: UserService,
    private modalService: NgbModal, 
    private alert: Alert, 
    private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.service.RefreshRequired.subscribe(respone=>{
      this.fetchUsers();
    })
  }

  fetchUsers() {
    this.service.getUsers().subscribe((response: any) => {
      this.users = response.map((user: any) => ({
        id: user.userId,
        userName: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        status: user.status === 'A',
        role: user.role,
        phone: user.phone ? user.phone : 'no contact',
        isChanged: false, // Track if a row has changed
        isActive: user.status === 'A' ? true : false,
        failureCount: user.failureCount,
        lockedOut: user.lockedOut,
        // Apply the formatDate method for the createdDate and lastLoginDate
        createdDate: this.formatDate(user.createdDate),
        lastLoginDate: user.lastLoginDate ? this.formatDate(user.lastLoginDate) : '-----',   
        creator: user.createBy ? user.createBy : 'System',
        updateDate: this.formatDate(user.updateDate),
        emp_dep_code: user.emp_dep_code ? user.emp_dep_code : '-----',
      }));
      this.dataSource.data = this.users; // Update data source
    },  
    (error) => {
      this.alert.error('Failed to fetch users');
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0]; 
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Return the formatted date and time together
    return `${formattedDate} ${formattedTime}`;
  }
  
  // Search query 
  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // Clear the search input and trigger the filter with empty value
  clearSearch() {
    this.searchQuery = ''; // Clear the input
    this.applyFilter(); // Re-apply filter with an empty search query
  }

  toggleLockedOut(user: User){
    const updatedUser = {...user };
    updatedUser.status = updatedUser.isActive ? 'A' : 'I'; 
    user.lockedOut = !user.lockedOut;

     // Prepare userRequest object
     const userRequest = {
      userId: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      status: updatedUser.status,
      phone: updatedUser.phone,
      lockedOut: updatedUser.lockedOut,
    };

    // Call the API to update the user status
    this.service.updateUser(userRequest).subscribe(
      (response) => {      
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
              this.users[index] = updatedUser;
              this.dataSource.data = [...this.users]; // Refresh data
          }
          this.fetchUsers();
          this.alert.success('User lock updated successfully');
          console.log(`Updated user ${updatedUser.userName} isLocked= ${updatedUser.lockedOut}`);
      },
      (error) => {
          this.alert.error('Unsuccessful in updating user');
          console.error('Unsuccessful in updating user:', error);
      }
    );

  }

  toggleStatus(user: User) {
    const updatedUser = { ...user };
    updatedUser.isActive = !updatedUser.isActive;
    updatedUser.status = updatedUser.isActive ? 'A' : 'I';

    // Prepare userRequest object
    const userRequest = {
      userId: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      status: updatedUser.status,
      phone: updatedUser.phone,
      lockedOut: updatedUser.lockedOut,
    };

    // Call the API to update the user status
    this.service.updateUser(userRequest).subscribe(
      (response) => {
          this.alert.success('User status updated successfully');
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
              this.users[index] = updatedUser;
              this.dataSource.data = [...this.users]; // Refresh data
          }
          this.fetchUsers();
          console.log(`Updated user ${updatedUser.userName} isActive= ${updatedUser.isActive}`);
      },
      (error) => {
          this.alert.error('Unsuccessful in updating user');
          console.error('Unsuccessful in updating user:', error);
      }
    );
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
        }
        this.fetchUsers(); 
        console.log('Result from dialog',result);
      }
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }
}

export { User };

