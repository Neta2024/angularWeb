import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProjectManagementComponent } from './project-management.component';
import { OverviewModule } from './overview/overview.module';
import { TypeModule } from "./type/type.module";
import { CostModule } from "./cost/cost.module";


@NgModule({
  declarations: [
    ProjectManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    FormsModule,
    SharedModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,
    FormsModule,
    MatGridListModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProjectManagementComponent,
      },
      {
        path: ':id',
        component: ProjectManagementComponent,
      }
    ]),
    OverviewModule,
    TypeModule,
    CostModule
  ],
})

export class ProjectManagementModule {}