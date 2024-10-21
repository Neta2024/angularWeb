import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { Overview } from '../model/overview.model';
import { OverviewService } from '../services/overview.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit{

  displayedColumns: string[] = [
    'no',
    'project',
    'type',
    'status',
    'start',
    'end',
    'price',
    'cost',
  ];
  
  dataSource = new MatTableDataSource<Overview>([]); 

  overviews: any[] = [];

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
    private service: OverviewService,
    private alert: Alert,
    private modalService: NgbModal, 
    private dialog: MatDialog 
  ) {
    
  }

  ngOnInit(): void {
    this.fetchOverview();
  }

  fetchOverview() {
    this.service.getOverview(this.request).subscribe(
      (response: any) => {

        if (Array.isArray(response)) {
          this.overviews = response.map((overview: any) => ({
            projectId: overview.project_id,
            projectName: overview.project_name,
            projectType: overview.project_type,
            projectStatus: overview.project_status,
            startDate: overview.start_date,
            endDate: overview.end_date,
            projectPrice: overview.project_price,
            psCost: overview.ps_cost,
          }));          

          this.dataSource.data = this.overviews;
          console.log('overview:', this.dataSource.data);
        } else {
          this.alert.error('Unexpected response format');
        }
      },
      (error) => {
        this.alert.error('Failed to fetch overview\'s data ');
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

export { Overview };
