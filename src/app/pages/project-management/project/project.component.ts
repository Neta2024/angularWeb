import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Project } from '../model/project.model';
import { ProjectService } from '../services/project.service';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})

export class ProjectComponent implements OnInit{
  displayedColumns: string[] = [
    'project',
    'type',
    'status',
    'start',
    'end',
    'price',
    'cost',
    'action'
  ];
  
  dataSource = new MatTableDataSource<Project>([]); 

  projects: any[] = [];

  request: any = {
    projectId: 0,           
    projectName: '',
    projectType: '',
    projectStatus: '',
    startDate: '',
    endDate: '',
    projectPrice: 0,
    psCost: 0,
  };
  searchQuery: string = '';
  isAddMode: boolean;

  constructor( 
    private service: ProjectService,
    private alert: Alert,
    private modalService: NgbModal, 
    private dialog: MatDialog 
  ) {
    
  }

  ngOnInit(): void {
    this.fetchProject();
  }

  fetchProject() {
    this.service.getPj(this.request).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.projects = response.map((project: any) => ({
            projectId: project.project_id,
            projectName: project.project_name,
            projectType: project.project_type,
            projectStatus: project.project_status,
            startDate: project.start_date,
            endDate: project.end_date,
            projectPrice: project.project_price,
            psCost: project.ps_cost,
          }));
          this.dataSource.data = this.projects;
          console.log('Project:', this.dataSource.data);
        } else {
          this.alert.error('Unexpected response format!');
        }
      },
      (error) => {
        this.alert.error('Failed to fetch project\'s data!');
      }
    );
  }

  // Add Project
  addProject(request: any){
    this.service.addPj(request).subscribe(
      (response) => {
        console.log('Added project successfully:', response);
        this.alert.success('Added project successfully');
        this.fetchProject();
      },
      (error) => {
        this.alert.error(error.message);
        console.error('Fail to add project:', error);
      }
    );
  }

  // Update Project
  updateProject(request: any){
    this.service.updatePj(request).subscribe(
      (response) => {
        console.log('Updated project successfully:', response);
        this.alert.success('Updated project successfully');
        this.fetchProject();
      },
      (error) => {
        this.alert.error(error.message);
        console.error('Fail to update project:', error);
      }
    );
  }

  // Delete Project
  deleteProject(projectId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '315px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure to delete this project?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deletePj({ pjid: projectId }).subscribe(
          (response) => {
            this.alert.success('Deleted project successfully!');
            this.fetchProject();
          },
          (error) => {
            this.alert.error(error.message);
          }
        );
      }
    });
  }

  // Open Add Dialog
  openDialog(): void {
    this.isAddMode = true;
    const modalRef = this.modalService.open(ProjectDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.isAddMode = this.isAddMode;

    modalRef.result.then((result) => {
      if (result) {
        this.addProject(result);
        console.log('Result from dialog:', result);
      }
    }).catch((error) => {
      console.log('Modal dismissed!');
    });
  }

  // Open Edit Dialog
  openEditDialog(project : Project): void {
    this.isAddMode = false;
    const modalRef = this.modalService.open(ProjectDialogComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.isAddMode = this.isAddMode;
    modalRef.componentInstance.project = {
      project_id: project.projectId,
      project_name: project.projectName,
      project_type: project.projectType,
      project_status: project.projectStatus,
      start_date: project.startDate,
      end_date: project.endDate,
      project_price: project.projectPrice,
      ps_cost: project.psCost,
    };

    modalRef.result.then((result) => {
      if (result) {
        const index = this.projects.findIndex(u => u.projectId === result.project_id);
        if (index !== -1) {
          this.updateProject(result); 
        }
        console.log('Result from dialog:', result);
      }
    }).catch((error) => {
      console.log('Modal dismissed!');
    });
  }

  // Search Query 
  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  clearSearch() {
    this.searchQuery = '';
    this.applyFilter();
  }
}

export { Project };