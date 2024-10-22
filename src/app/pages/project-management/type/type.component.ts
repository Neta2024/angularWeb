import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Type } from '../model/type.model';
import { TypeService } from '../services/type.service';
import { TypeDialogComponent } from './type-dialog/type-dialog.component';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrl: './type.component.scss',
})

export class TypeComponent implements OnInit{
  displayedColumns: string[] = [
    'code',
    'name',
    'action'
  ];
  
  dataSource = new MatTableDataSource<Type>([]); 

  types: any[] = [];

  request: any = {
    pjTypeId: 0,
    pjTypeCode: '',
    pjTypeName: '',
  };
  searchQuery: string = '';
  isAddMode: boolean;

  constructor( 
    private service: TypeService,
    private alert: Alert,
    private modalService: NgbModal, 
    private dialog: MatDialog 
  ) {
    
  }

  ngOnInit(): void {
    this.fetchType();
  }

  fetchType() {
    this.service.getPjType(this.request).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.types = response.map((type: any) => ({
            pjTypeId: type.pj_type_id,
            pjTypeCode: type.pj_type_code,
            pjTypeName: type.pj_type_name,
          }));
          this.dataSource.data = this.types;
          console.log('Type:', this.dataSource.data);
        } else {
          this.alert.error('Unexpected response format!');
        }
      },
      (error) => {
        this.alert.error('Failed to fetch type\'s data!');
      }
    );
  }

  // Add Project
  addType(request: any){
    this.service.addPjType(request).subscribe(
      (response) => {
        console.log('Added project type successfully:', response);
        this.alert.success('Added project type successfully');
        this.fetchType();
      },
      (error) => {
        this.alert.error(error.message);
        console.error('Fail to add project type:', error);
      }
    );
  }

  // Update Project
  updateType(request: any){
    this.service.updPjType(request).subscribe(
      (response) => {
        console.log('Updated project type successfully:', response);
        this.alert.success('Updated project type successfully');
        this.fetchType();
      },
      (error) => {
        this.alert.error(error.message);
        console.error('Fail to update project type:', error);
      }
    );
  }

  // Delete Project
  deleteType(pjTypeId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '315px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure to delete this project type?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delPjType({ pj_type_id: pjTypeId }).subscribe(
          (response) => {
            this.alert.success('Deleted Project Type Successfully!');
            this.fetchType();
          },
          (error) => {
            this.alert.error(error.message);
          }
        );
      }
    });
  }

  // Open Add Dialog
  openTypeDialog(): void {
    this.isAddMode = true;
    const modalRef = this.modalService.open(TypeDialogComponent, {
      size: 'sm',
      centered: true
    });

    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.isAddMode = this.isAddMode;

    modalRef.result.then((result) => {
      if (result) {
        this.addType(result);
        console.log('Result from dialog:', result);
      }
    }).catch((error) => {
      console.log('Modal dismissed!');
    });
  }

  // Open Edit Dialog
  openEditTypeDialog(type : Type): void {
    this.isAddMode = false;
    const modalRef = this.modalService.open(TypeDialogComponent, {
      size: 'sm',
      centered: true
    });

    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.isAddMode = this.isAddMode;
    modalRef.componentInstance.type = type;

    modalRef.result.then((result) => {
      if (result) {
        const index = this.types.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.updateType(result); 
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

export { Type };