import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
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

  // By default save and cancel buttons are disabled
  buttonsDisabled: boolean = true;

  // Data source for the table
  dataSource = new MatTableDataSource<UserPermission>([]);

  // Columns displayed in the table
  displayedColumns: string[] = ['user', 'fullName', 'role'];

  // Example data to display
  userPermissions: UserPermission[] = [];

  // Track role changes
  userRoleUpdates: { userId: number; role: string }[] = [];

  constructor(private restApi: RestApi, private alert: Alert) {}

  ngOnInit(): void {
    this.fetchUsers();
    // this.dataSource.data = this.userPermissions;
  }

  fetchUsers(){
    this.restApi.get('admin/users/get').subscribe((response: any) => {
      this.users = response.map((user: any ) => ({
        id: user.userId,
        userName: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role.toUpperCase(),
        isChanged: false // Track if a row has changed
      })); 
      this.dataSource.data = this.users;
    })
  }

   // Method to track changes in role selector
  checkIfDataChanged(): void {
    const dataChanged = JSON.stringify(this.dataSource.data) !== JSON.stringify(this.fetchUsers);
    this.buttonsDisabled = !dataChanged;
  }

  // Track changes in roles
  onRoleChange(element: any){
    // Mark the role as changed
    element.isChanged = true;

    const existingUpdate = this.userRoleUpdates.find(update => update.userId === element.id);

    if(existingUpdate) {
      existingUpdate.role = element.role;
    } else {
      this.userRoleUpdates.push({ userId: element.id, role: element.role });
    }

    console.log('Update Roles: ', this.userRoleUpdates);
    
    this.checkIfDataChanged();
  }

  onSave(): void {

    if (this.userRoleUpdates.length > 0) {
      // Call the service to update the roles
      this.restApi.put('admin/users/user/role/update', this.userRoleUpdates).subscribe(
        response => {
          // Reset change tracking after saving
          this.userRoleUpdates = [];
          this.fetchUsers(); // Optionally, fetch users again to refresh data
          this.buttonsDisabled = true;
          this.alert.success("Successfully updated");
        },
        (error) => {
          this.alert.error("Unsuccessful update role");
          console.error('Error updating roles', error)
        }
      );
    }

    this.checkIfDataChanged();
    console.log('Updated Data:', this.dataSource.data); // Handle saving data
    this.buttonsDisabled = true; // Disable buttons 
  }

  onCancel(): void {
    this.userRoleUpdates = [];
    this.checkIfDataChanged();
    this.fetchUsers(); // Fetch updated data from server
    this.buttonsDisabled = true; // Disable buttons 
  }
}

export interface UserPermission {
  no: number;
  user: string;
  fullName: string;
  role: string;
  isChanged?: boolean; // Track if the row has been changed
}
