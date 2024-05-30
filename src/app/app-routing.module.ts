import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './pages/authentication/auth.guard';
import { Error1Component } from './pages/error1/error1.component';
import { LogoutComponent } from './pages/authentication/logout/logout.component';

const routes: Routes = [
  { path: 'timesheet', canActivate: [AuthGuard], loadChildren: () =>  import('./pages/layout.module').then((m) => m.LayoutModule), },
  { path: 'login', loadChildren: () => import('./pages/authentication/authentication.module').then((m) => m.AuthenticationModule), },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'error', component: Error1Component },
  { path: '**', redirectTo: 'login', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
