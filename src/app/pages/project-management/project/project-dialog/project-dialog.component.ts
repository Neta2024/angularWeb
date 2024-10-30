import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Alert } from 'src/app/shared/components/alert/alert';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.scss'
})

export class ProjectDialogComponent implements OnInit {
  @Input() mode: 'add' | 'edit';
  @Input() isAddMode: boolean;
  @Input() project: any = {};
  @Input() projectTypes: any[] = [];
  @Input() projectStatuses: any[] = [];

  projectForm: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private alert: Alert,
    public activeModal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    console.log('Project passed to dialog:', this.project);

    this.projectForm = this.fb.group({
      project_id: [this.project.project_id || null],
      project_name: ['', Validators.required],
      project_type: ['', Validators.required],
      project_status: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      project_price: ['', Validators.required],
      ps_cost: ['', Validators.required],
    });
  
    if (this.mode === 'edit' && this.project) {
      this.projectForm.patchValue({
        project_id: this.project.project_id,
        project_name: this.project.project_name,
        project_type: this.project.project_type,
        project_status: this.project.project_status,
        start_date: this.project.start_date,
        end_date: this.project.end_date,
        project_price: this.project.project_price,
        ps_cost: this.project.ps_cost,
      });
    }    
  }

  addProject(){
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const projectRequest = {
      project_name: this.projectForm.get('project_name').value,
      project_type: this.projectForm.get('project_type').value,
      project_status: this.projectForm.get('project_status').value,
      start_date: this.projectForm.get('start_date').value,
      end_date: this.projectForm.get('end_date').value,
      project_price: this.projectForm.get('project_price').value,
      ps_cost: this.projectForm.get('ps_cost').value,
    }
    this.activeModal.close(projectRequest);
  }

  editProject(){
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.alert.error('Please fill out the form correctly');
      return;
    }

    const projectRequest = {
      project_id: this.projectForm.get('project_id').value,
      project_name: this.projectForm.get('project_name').value,
      project_type: this.projectForm.get('project_type').value,
      project_status: this.projectForm.get('project_status').value,
      start_date: this.projectForm.get('start_date').value,
      end_date: this.projectForm.get('end_date').value,
      project_price: this.projectForm.get('project_price').value,
      ps_cost: this.projectForm.get('ps_cost').value,
    }
    console.log('Request to update project type:', projectRequest);

    this.activeModal.close(projectRequest);
  }

  onSubmit() {
    if (this.mode === 'add') {
      this.addProject();
    } else if (this.mode === 'edit') {
      this.editProject();
    }
  }

  onCancel() {
    this.activeModal.dismiss('cancel');
  }
}