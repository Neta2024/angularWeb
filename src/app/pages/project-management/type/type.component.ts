import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { Type } from '../model/type.model';
import { TypeService } from '../services/type.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent implements OnInit{

  displayedColumns: string[] = [
    'no',
    'name',
  ];
  
  dataSource = new MatTableDataSource<Type>([]); 

  types: any[] = [];

  request: any = {
    pjTypeId: 0,           
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
    this.fetchPjType();
  }

  fetchPjType() {
    this.service.getPjType(this.request).subscribe(
      (response: any) => {

        if (Array.isArray(response)) {
          this.types = response.map((type: any) => ({
            pjTypeId: type.pj_type_id,
            pjTypeName: type.pj_type_name,
          }));          

          this.dataSource.data = this.types;
          console.log('type:', this.dataSource.data);
        } else {
          this.alert.error('Unexpected response format');
        }
      },
      (error) => {
        this.alert.error('Failed to fetch type\'s data ');
      }
    );
  }

  // Delete project


  // Opens dialog
  

  // Opens the Edit Project dialog
  

  // Search query 
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
