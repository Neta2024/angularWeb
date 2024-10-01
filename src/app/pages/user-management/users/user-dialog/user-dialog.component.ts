import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/shared/components/alert/alert';
import { RestApi } from 'src/app/shared/rest-api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements OnInit{
  @Input() mode: 'add' | 'edit';
  @Input() isAddMode: boolean;
  @Input() user: any = {};  // Holds the user data
  @Output() userUpdated = new EventEmitter<void>(); // Emit event when user is updated

  // Fields for user details
  userId: number;
  password: string = '';
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  role: string = '';
  status: boolean = false;
  lockedOut: boolean = false;
  phone: string = '';

  showPassword: boolean = false;

  // Define the form group
  userForm: FormGroup;

  roles: string[] = ['ADMIN', 'USER', 'MANAGER']; // Role options
  // Inject services
  constructor(
    private service: UserService,
    private fb: FormBuilder,
    private alert: Alert,
    public activeModal: NgbActiveModal,

  ) {}

  ngOnInit(): void {
    this.service.RefreshRequired.subscribe(respone=>{
      this.addUser();
      this.editUser();
    })
    // Initialize the form
    if (this.mode === 'add' && this.user){
      this.userForm = this.fb.group({
        userId: [this.user.id == null],
        userName: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', Validators.required], // Only for add mode
        role: ['', Validators.required],
        status: [false], // For active/inactive toggle
        phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Only numbers allowed for phone
        department_code: [this.user.emp_dep_code],
  
      });
    }
    
    // Initialize form for edit mode
    if (this.mode === 'edit' && this.user) {
      this.userForm = this.fb.group({
        userId: [this.user.id],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        role: ['', Validators.required],
        status: [false], // For active/inactive toggle
        phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Only numbers allowed for phone
        department_code: [this.user.emp_dep_code],
        lockedOut:[this.user.lockedOut],
      });

      this.userForm.patchValue({
        userId: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        role: this.user.role,
        phone: this.user.phone,
        status: this.user.status ? this.status = true : false, // Assuming 'A' means active
        emp_dep_code: this.user.emp_dep_code,
        lockedOut: this.user.lockedOut, // Assuming 'N' means not locked out
      });
    }

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle the password visibility
  }
  
  toggleStatus() {
    this.status = !this.status;
  }

  toggleLockedOut() {
    this.lockedOut = !this.lockedOut;
  }

  // Method to add a user
  addUser() {
    if (this.userForm.invalid) {
      // Mark all controls as touched to trigger validation messages
      this.userForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const userRequest = {
      username: this.userForm.get('userName')?.value,
      email: this.userForm.get('userName')?.value, // Using username as email
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      pwd: this.userForm.get('password')?.value, // Only used in add mode
      role: this.userForm.get('role')?.value,
      status: this.userForm.get('status')?.value ? 'A' : 'I', // Convert status to A (active) / I (inactive)
      phone: this.userForm.get('phone')?.value,
    };

    // Call Service API
    this.service.addUser(userRequest).subscribe(
      (response) => {
        console.log('User added successfully', response);
        this.alert.success('User added successfully');
        this.userUpdated.emit(); // Emit event to notify user update
        this.activeModal.close(userRequest); // Close modal on success
      },
      (error) => {
        this.alert.error('Unsuccessful in adding user');
        console.error('Unsuccessful in adding user:', error);
      }
    );
  }

  editUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const userRequest = {
      userId : this.userForm.get('userId')?.value,
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      role: this.userForm.get('role')?.value,
      status: this.userForm.get('status')?.value ? 'A' : 'I', // Convert status to A (active) / I (inactive)
      phone: this.userForm.get('phone')?.value,
      lockedOut: this.userForm.get('lockedOut').value,
    };

    this.service.updateUser(userRequest).subscribe(
      (response) => {
        console.log('User updated successfully', response);
        this.alert.success('User updated successfully');
        this.userUpdated.emit(); // Emit event to notify that the user has been updated
        this.activeModal.close(userRequest); // Close modal or redirect after update
      },
      (error) => {
        this.alert.error('Unsuccessful in updating user');
        console.error('Unsuccessful in updating user:', error);
      }
    );
  }


  onSubmit() {
    if (this.mode === 'add') {
      this.addUser();
    } else if (this.mode === 'edit') {
      this.editUser();
    }
  }

  onCancel() {
    this.activeModal.dismiss('cancel');
  }

}