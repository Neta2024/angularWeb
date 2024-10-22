import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Overview } from '../model/overview.model';
import { OverviewService } from '../services/overview.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})

export class OverviewComponent implements OnInit{
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
    this.fetchProject();
  }

  fetchProject() {
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
          console.log('Overview:', this.dataSource.data);
        } else {
          this.alert.error('Unexpected response format!');
        }
      },
      (error) => {
        this.alert.error('Failed to fetch overview\'s data!');
      }
    );
  }

  // Add Project

  // Update Project

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
        this.service.delOverview({ pjid: projectId }).subscribe(
          (response) => {
            this.alert.success('Deleted Project Successfully!');
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

  // Open Edit Dialog

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

export { Overview };
