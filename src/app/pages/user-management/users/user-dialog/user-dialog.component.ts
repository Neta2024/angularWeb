import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Alert } from 'src/app/shared/components/alert/alert';
import { RestApi } from 'src/app/shared/rest-api';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent {
  userId = 0;
  userName = '';
  firstName = '';
  lastName = '';
  password = '';
  role = '';
  status = ''; // Default to active
  phone = '';

   // Define roles for the dropdown
  roles: string[] = ['ADMIN', 'USER'];

  constructor(
    private restApi: RestApi,
    private alert: Alert,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.mode === 'edit') {
      // If editing, pre-populate the fields with the existing user data
      this.userId = data.user.id;
      this.firstName = data.user.firstName;
      this.lastName = data.user.lastName;
      this.status = data.user.status === 'A' ? 'active' : 'inactive',
      this.role = data.user.role === 'admin' ? 'admin' : 'user';
      this.phone = data.user.phone;
    } else{
       // Initialize role and status for 'add' mode
       this.role = 'user'; // Default role
       this.status = 'active'; // Default status
       this.password = this.password;
       
    }
  }

  toggleStatus(element: any) {
    // Handle status toggle here
    console.log('Status toggled for:', element);
    // You can update the element or call a service to persist the change
  }

  addUser(): void{
    const userRequest = {
      username: this.userName,
      email: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      pwd : this.password,
      role: this.role, 
      status: this.status,
      phone: this.phone,
    };
    console.log(userRequest);
    this.restApi.post('/admin/users/user/add', userRequest).subscribe(response => {
      console.log('User added successfully', response);
      this.alert.success('User added successfully');
      this.dialogRef.close(); 
    }, (error) => {
      this.alert.error("Unsuccessful add user");
      console.error('Unsuccessful add user:', error);
    });

  }

  onSave(): void {
    const user = {
      id: this.data.user.id,
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      pwd: this.password, 
      role: this.role, 
      status: this.status,
      phone: this.phone,
    };

    this.dialogRef.close(user); 
  }

  onCancel(): void {
    this.dialogRef.close(); // Close dialog without saving
  }
}