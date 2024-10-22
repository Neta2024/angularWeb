import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alert } from 'src/app/shared/components/alert/alert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Cost } from '../model/cost.model';
import { CostService } from '../services/cost.service';

@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  styleUrl: './cost.component.scss',
})

export class CostComponent implements OnInit{
  displayedColumns: string[] = [
    'name',
    'amount',
    'created',
    'action'
  ];
  
  dataSource = new MatTableDataSource<Cost>([]); 

  costs: any[] = [];

  request: any = {
    pjCostId: 0,
    costName: '',
    costAmt: 0,
    createdOn: '',
  };
  searchQuery: string = '';
  isAddMode: boolean;

  constructor( 
    private service: CostService,
    private alert: Alert,
    private modalService: NgbModal, 
    private dialog: MatDialog 
  ) {

  }

  ngOnInit(): void {
    this.fetchCost();
  }

  // Get All Project Costs
  fetchCost() {
    this.service.getPjCost(this.request).subscribe(
      (response: any) => {

        if (Array.isArray(response)) {
          this.costs = response.map((cost: any) => ({
            pjCostId: cost.pjCostId,
            costName: cost.costName,
            costAmt: cost.costAmt,
            createdOn: cost.createDatetime,
          }));

          this.dataSource.data = this.costs;
          console.log('Cost:', this.dataSource.data);
        } else {
          this.alert.error('Unexpected response format');
        }
      },
      (error) => {
        this.alert.error('Failed to fetch cost\'s data ');
      }
    );
  }

  // Add Project Cost

  // Update Project Cost

  // Delete Project Cost
  deleteCost(pjCostId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '315px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure to delete this project cost?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delPjCost({ pjCostId: pjCostId }).subscribe(
          (response) => {
            this.alert.success('Project cost deleted successfully!');
            this.fetchCost();
          },
          (error) => {
            this.alert.error(error.message);
          }
        );
      }
    });
  }

  // Open Dialog

  // Open Edit Dialog

  applyFilter() {
    const filterValue = this.searchQuery.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  clearSearch() {
    this.searchQuery = '';
    this.applyFilter();
  }
}

export { Cost };