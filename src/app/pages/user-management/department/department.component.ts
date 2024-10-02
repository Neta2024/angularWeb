import { Component, OnInit } from '@angular/core';
import { Department } from '../model/department.model';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { DepartmentService } from '../services/department.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';



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
  dataSource = new MatTableDataSource<Department>([]); 

  departments: any[] = [];
  // set default request parameters
  requestDep: any = {
    emp_dep_id: 0,           
    emp_dep_code: '',
    emp_dep_name: ''
  };
  searchQuery: string = '';
  isAddMode: boolean;

  constructor( 
    private service: DepartmentService,
    private alert: Alert,
    private modalService: NgbModal, 
   ) {
    
   }

  ngOnInit(): void {
    this.fetchDepartment();
   
  }

  fetchDepartment() {
    this.service.getDepartments(this.requestDep).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.departments = response.map((department: any) => ({
            emp_dep_id: department.emp_dep_id,
            emp_dep_code: department.emp_dep_code,
            emp_dep_name: department.emp_dep_name
          }));
          this.dataSource.data = this.departments;
        } else {
          this.alert.error('Unexpected response format');
        }
      },
      (error) => {
        this.alert.error('Failed to fetch departments');
      }
    );
  }

  addDepartment(requestDep: any){
    // Call Service API
    this.service.addDepartment(requestDep).subscribe(
      (response) => {
        console.log('Department added successfully', response);
        this.alert.success('Department added successfully');
        this.fetchDepartment();
      },
      (error) => {
        this.alert.error(error.message);
        console.error('Unsuccessful in adding user:', error);
      }
    );
  }

  updateDepartment(requestDep: any){
    // Call Service API
    this.service.updateDepartment(requestDep).subscribe(
      (response) => {
        console.log('Department updated successfully', response);
        this.alert.success('Department updated successfully');
        this.fetchDepartment();
      },
      (error) => {
        this.alert.error(error.message);
        console.error('Unsuccessful in updating department:', error);
      }
    );
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
        this.addDepartment(result);
        // this.departments.push(result);  
        // this.dataSource.data = [...this.departments]; // Refresh data     
        console.log('Result from dialog',result);
      }
    }).catch((error) => {
      console.log('Modal dismissed');
    });
  }

  // Opens the Edit User dialog
  openEditDepartmentDialog(department : Department): void {
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
          // this.departments[index] = result;        
          // this.dataSource.data = [...this.departments]; // Refresh data
          this.updateDepartment(result); 
        }   
        console.log('Result from dialog',result);
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
