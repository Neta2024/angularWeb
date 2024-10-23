import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/shared/components/alert/alert';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrl: './status-dialog.component.scss'
})

export class StatusDialogComponent implements OnInit {
  @Input() mode: 'add' | 'edit';
  @Input() isAddMode: boolean;
  @Input() status: any = {};

  statusForm: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private alert: Alert,
    public activeModal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    if (this.mode === 'add' && this.status){
      this.statusForm = this.fb.group({
        pj_s_id: [this.status.pj_s_id == null],
        status: ['', Validators.required],
        type: ['', Validators.required],
        phase_code: ['', Validators.required],
      });
    }

    if(this.mode === 'edit' && this.status){
      this.statusForm = this.fb.group({
        pj_s_id: [this.status.pj_s_id],
        status: ['', Validators.required],
        type: ['', Validators.required],
        phase_code: ['', Validators.required],
      });
    }

    this.statusForm.patchValue({
      pj_s_id: this.status.pj_s_id,
      status: this.status.status,
      type: this.status.type,
      phase_code: this.status.phase_code,
    })
  }

  addStatus(){
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const typeRequest = {
      status: this.statusForm.get('status').value,
      type: this.statusForm.get('type').value,
      phase_code: this.statusForm.get('phase_code').value,
    }
    this.activeModal.close(typeRequest);
  }

  editStatus(){
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const typeRequest = {
      pj_s_id: this.statusForm.get('pj_s_id').value,
      status: this.statusForm.get('status').value,
      type: this.statusForm.get('type').value,
      phase_code: this.statusForm.get('phase_code').value,
    }
    this.activeModal.close(typeRequest);
  }

  onSubmit() {
    if (this.mode === 'add') {
      this.addStatus();
    } else if (this.mode === 'edit') {
      this.editStatus();
    }
  }

  onCancel() {
    this.activeModal.dismiss('cancel');
  }
}