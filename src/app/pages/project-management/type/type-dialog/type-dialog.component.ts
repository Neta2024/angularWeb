import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/shared/components/alert/alert';

@Component({
  selector: 'app-type-dialog',
  templateUrl: './type-dialog.component.html',
  styleUrl: './type-dialog.component.scss'
})

export class TypeDialogComponent implements OnInit {
  @Input() mode: 'add' | 'edit';
  @Input() isAddMode: boolean;
  @Input() type: any = {};

  typeForm: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private alert: Alert,
    public activeModal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    if (this.mode === 'add' && this.type){
      this.typeForm = this.fb.group({
        pj_type_id: [this.type.pj_type_id == null],
        pj_type_code: ['', Validators.required],
        pj_type_name: ['', Validators.required],
      });
    }

    if(this.mode === 'edit' && this.type){
      this.typeForm = this.fb.group({
        pj_type_id: [this.type.pj_type_id],
        pj_type_code: ['', Validators.required],
        pj_type_name: ['', Validators.required],
      });
    }

    this.typeForm.patchValue({
      pj_type_id: this.type.pj_type_id,
      pj_type_code: this.type.pj_type_code,
      pj_type_name: this.type.pj_type_name,
    })
  }

  addType(){
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const typeRequest = {
      pj_type_code: this.typeForm.get('pj_type_code').value,
      pj_type_name: this.typeForm.get('pj_type_name').value,
    }
    this.activeModal.close(typeRequest);
  }

  editType(){
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const typeRequest = {
      pj_type_id: this.typeForm.get('pj_type_id').value,
      pj_type_code: this.typeForm.get('pj_type_code').value,
      pj_type_name: this.typeForm.get('pj_type_name').value,
    }
    this.activeModal.close(typeRequest);
  }

  onSubmit() {
    if (this.mode === 'add') {
      this.addType();
    } else if (this.mode === 'edit') {
      this.editType();
    }
  }

  onCancel() {
    this.activeModal.dismiss('cancel');
  }
}