import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './pages/authentication/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import LoginComponent from './pages/authentication/login/login.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: AdminComponent,
//     children: [
//       {
//         path: '',
//         redirectTo: '/default',
//         pathMatch: 'full'
//       },
//       {
//         path: 'default',
//         loadComponent: () => import('./demo/default/default.component').then((c) => c.DefaultComponent)
//       },
//       {
//         path: 'typography',
//         loadComponent: () => import('./demo/elements/typography/typography.component')
//       },
//       {
//         path: 'color',
//         loadComponent: () => import('./demo/elements/element-color/element-color.component')
//       },
//       {
//         path: 'sample-page',
//         loadComponent: () => import('./demo/sample-page/sample-page.component')
//       }
//     ]
//   },
//   {
//     path: '',
//     component: GuestComponent,
//     children: [
//       {
//         path: 'guest',
//         loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
//       }
//     ]
//   }
// ];
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'resetpw', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
