import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { Error1Component } from './error1/error1.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { AuthGuard } from './authentication/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./../demo/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'detail',
        loadChildren: () => import('./timesheet/timesheet.module').then((m) => m.TimesheetModule),
      },
      {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then((m) => m.CalendarModule),
      },
      {
        path: 'leaveCalendar',
        loadChildren: () => import('./leave-calendar/leave-calendar.module').then((m) => m.LeaveCalendarModule),
      },
      {
        path: 'holidays',
        loadChildren: () => import('./holiday/holiday.module').then((m) => m.HolidayModule),
      },
      {
        path: 'user-management',
        loadChildren: () => import('./user-management/user-management.module').then((m) => m.UserManagementModule),
        canActivate: [AuthGuard], // Use AuthGuard to protect the route
        data: { guardMethod: 'canActivateAdmin' },  // This tells the guard to use the canActivateAdmin method
      },
      {
        path: 'project-management',
        loadChildren: () => import('./project-management/project-management.module').then((m) => m.ProjectManagementModule),
        canActivate: [AuthGuard],
        data: { guardMethod: 'canActivateAdmin' },
      },
      {
        path: 'typography',
        loadComponent: () => import('./../demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./../demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./../demo/sample-page/sample-page.component')
      },
      { path: 'logout', component: LogoutComponent },
      { path: 'error', component: Error1Component },
      { path: '**', redirectTo: '', pathMatch: 'full'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
