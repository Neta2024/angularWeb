import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Status } from '../model/status.model';
import { StatusService } from '../services/status.service';
import { StatusDialogComponent } from './status-dialog/status-dialog.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})

export class StatusComponent implements OnInit{
  displayedColumns: string[] = [
    'name',
    'type',
    'code',
    'action'
  ];
  
  dataSource = new MatTableDataSource<Status>([]); 

  statuses: any[] = [];

  request: any = {
    pjStatusId: 0,
    pjStatusName: '',
    pjStatusType: '',
    pjStatusCode: '',
  };
  searchQuery: string = '';
  isAddMode: boolean;

  constructor( 
    private service: StatusService,
    private alert: Alert,
    private modalService: NgbModal, 
    private dialog: MatDialog 
  ) {
    
  }

  ngOnInit(): void {
    this.fetchStatus();
  }

  fetchStatus() {
    this.service.getPjStatus(this.request).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.statuses = response.map((status: any) => ({
            pjStatusId: status.pj_s_id,
            pjStatusName: status.status,
            pjStatusType: status.type,
            pjStatusCode: status.phase_code,
          }));
          this.dataSource.data = this.statuses;
          console.log('Status:', this.dataSource.data);
        } else {
          this.alert.error('Unexpected response format!');
        }
      },
      (error) => {
        this.alert.error('Failed to fetch status data!');
      }
    );
  }

  // Add Project
  addStatus(request: any){
    this.service.addPjStatus(request).subscribe(
      (response) => {
        console.log('Added project status successfully:', response);
        this.alert.success('Added project status successfully');
        this.fetchStatus();
      },
      (error) => {
        this.alert.error(error.message);
        console.error('Fail to add project status:', error);
      }
    );
  }

  // Update Project
  updateStatus(request: any){
    this.service.updPjStatus(request).subscribe(
      (response) => {
        console.log('Updated project status successfully:', response);
        this.alert.success('Updated project status successfully');
        this.fetchStatus();
      },
      (error) => {
        this.alert.error(error.message);
        console.error('Fail to update project status:', error);
      }
    );
  }

  // Delete Project
  deleteStatus(pjStatusId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '315px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure to delete this project status?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delPjStatus({ pj_s_id: pjStatusId }).subscribe(
          (response) => {
            this.alert.success('Deleted project status successfully!');
            this.fetchStatus();
          },
          (error) => {
            this.alert.error(error.message);
          }
        );
      }
    });
  }

  // Open Add Dialog
  openStatusDialog(): void {
    this.isAddMode = true;
    const modalRef = this.modalService.open(StatusDialogComponent, {
      size: 'sm',
      centered: true
    });

    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.isAddMode = this.isAddMode;

    modalRef.result.then((result) => {
      if (result) {
        this.addStatus(result);
        console.log('Result from dialog:', result);
      }
    }).catch((error) => {
      console.log('Modal dismissed!');
    });
  }

  // Open Edit Dialog
  openEditStatusDialog(status : Status): void {
    this.isAddMode = false;
    const modalRef = this.modalService.open(StatusDialogComponent, {
      size: 'sm',
      centered: true
    });

    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.isAddMode = this.isAddMode;
    modalRef.componentInstance.status = status;

    modalRef.result.then((result) => {
      if (result) {
        const index = this.statuses.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.updateStatus(result); 
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

export { Status };