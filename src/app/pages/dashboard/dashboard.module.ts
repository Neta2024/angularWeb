import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

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
  declarations: [DashboardComponent]
})
export class DashboardModule { }
