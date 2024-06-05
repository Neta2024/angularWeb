import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { Chart1Component } from './chart1/chart1.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
          path: '',
          component: DashboardComponent,
      },
      {
          path: ':id',
          component: DashboardComponent,
      },
      {
          path: 'batch-edit/:id',
          component: DashboardComponent,
      }
    ])
  ],
  declarations: [
    DashboardComponent,
    Chart1Component]
})
export class DashboardModule { }
