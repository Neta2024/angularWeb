import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/shared/components/alert/alert';

@Component({
  selector: 'app-department-dialog',
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.scss'
})
export class DepartmentDialogComponent  implements OnInit {
 
  @Input() mode: 'add' | 'edit';
  @Input() isAddMode: boolean;
  @Input() department: any = {};

  departmentForm: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private alert: Alert,
    public activeModal: NgbActiveModal,) {
    }

  ngOnInit(): void {

    // Initialize the form
    if (this.mode === 'add' && this.department){
      this.departmentForm = this.fb.group({
        emp_dep_id: [this.department.emp_dep_id == null],
        emp_dep_code: ['', Validators.required],
        emp_dep_name: ['', Validators.required],
      });
    }

    if(this.mode === 'edit' && this.department){
      this.departmentForm = this.fb.group({
        emp_dep_id: [this.department.emp_dep_id],
        emp_dep_code: ['', Validators.required],
        emp_dep_name: ['', Validators.required],
      });
    }

    this.departmentForm.patchValue({
      emp_dep_id: this.department.emp_dep_id,
      emp_dep_code: this.department.emp_dep_code,
      emp_dep_name: this.department.emp_dep_name,
    })
   
  }

  addDepartment(){
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const departmentRequest = {
      emp_dep_code: this.departmentForm.get('emp_dep_code').value,
      emp_dep_name: this.departmentForm.get('emp_dep_name').value,
    }
    
    this.activeModal.close(departmentRequest);
  }

  editDepartment(){
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const departmentRequest = {
      emp_dep_id: this.departmentForm.get('emp_dep_id').value,
      emp_dep_code: this.departmentForm.get('emp_dep_code').value,
      emp_dep_name: this.departmentForm.get('emp_dep_name').value,
    }
    this.activeModal.close(departmentRequest);

  }

  onSubmit() {
    if (this.mode === 'add') {
      this.addDepartment();
    } else if (this.mode === 'edit') {
      this.editDepartment();
    }
  }

  onCancel() {
    this.activeModal.dismiss('cancel');
  }

}
