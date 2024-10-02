import { Component, OnInit } from '@angular/core';
import { Department } from '../model/department.model';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { DepartmentService } from '../services/department.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';

export interface DepartmentMockUp {
  dep_id: number
  dep_code: string;
  dep_name: string;
}


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent implements OnInit{

  // Columns to display in the table
  displayedColumns: string[] = [
    'dep_code',
    'dep_name'
   ];
  dataSource = new MatTableDataSource<DepartmentMockUp>([
    { dep_id:1, dep_code: 'HR01', dep_name: 'Human Resources' },
    { dep_id:2, dep_code: 'IT02', dep_name: 'Information Technology' },
    { dep_id:3, dep_code: 'FN03', dep_name: 'Finance' },
    { dep_id:4,dep_code: 'MK04', dep_name: 'Marketing' },
    { dep_id:5, dep_code: 'SA05', dep_name: 'Sales' },
    { dep_id:6, dep_code: 'PR06', dep_name: 'Procurement' }
  ]); 

  departments: any[] = [];
  searchQuery: string = '';
  isAddMode: boolean;

  constructor( 
    private service: DepartmentService,
    private alert: Alert,
    private modalService: NgbModal, 
   ) {
    
   }

  ngOnInit(): void {
   
  }

  fetchDepartment(){

  }

  // Opens the department dialog
  openDepartmentDialog(): void {
    this.isAddMode = true;
    const modalRef = this.modalService.open(DepartmentDialogComponent, {
      size: 'sm', // You can specify the size of the modal (lg, sm, etc.)
      centered: true
    });

    // Pass data to the modal component
    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.isAddMode = this.isAddMode;

    // Handle the modal close event
    modalRef.result.then((result) => {
      if (result) {
        // Add the new user to the data source and refresh the table
        this.departments.push(result);  
        this.dataSource.data = [...this.departments]; // Refresh data     
        this.fetchDepartment();
       
      }
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }

  // Opens the Edit User dialog
  openEditDepartmentDialog(department : DepartmentMockUp): void {
    this.isAddMode = false;
    const modalRef = this.modalService.open(DepartmentDialogComponent, {
      size: 'sm',
      centered: true
    });

    // Pass data to the modal component
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.isAddMode = this.isAddMode;
    modalRef.componentInstance.department = department;

    // Handle the modal close event
    modalRef.result.then((result) => {
      if (result) {
        // Update the user in the list and refresh the table
        const index = this.departments.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.departments[index] = result;      
          this.dataSource.data = [...this.departments]; // Refresh data
        }
        this.fetchDepartment();
        console.log(result);
      }
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }

  // Search query 
  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

   // Clear the search input and trigger the filter with empty value
  clearSearch() {
    this.searchQuery = ''; // Clear the input
    this.applyFilter(); // Re-apply filter with an empty search query
  }

}

export { Department };
