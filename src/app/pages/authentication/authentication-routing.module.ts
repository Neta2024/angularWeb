import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthMainComponent } from './auth-main/auth-main.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: AuthMainComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
        data: { returnUrl: window.location.href }
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
