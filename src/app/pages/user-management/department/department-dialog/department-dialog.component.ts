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
        dep_Id: [this.department.id == null],
        dep_code: ['', [Validators.required,]],
        dep_name: ['', Validators.required],
      });
    }

    if(this.mode === 'edit' && this.department){
      this.departmentForm = this.fb.group({
        dep_Id: [this.department.id],
        dep_code: ['', [Validators.required,]],
        dep_name: ['', Validators.required],
      });
    }

    this.departmentForm.patchValue({
      dep_Id: this.department.dep_id,
      dep_code: this.department.dep_code,
      dep_name: this.department.dep_name,
    })
   
  }

  addDepartment(){

  }

  editDepartment(){

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
