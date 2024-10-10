import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RestApi } from 'src/app/shared/rest-api';
import { AuthModel } from './model/auth.model';

// export interface User {
//   token: string;
//   username: string;
//   fullName: string;
//   email: string;
//   role: string;
// }

const USER_KEY = 'ginkgorun';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private _user: AuthModel | null;

  constructor(private rest: RestApi, private router: Router) {
    this._user = null;
    try {
      const json = localStorage.getItem(USER_KEY);
      if (json) {
        this._user = JSON.parse(json);
      }
    } catch (e) { }
    this.rest.token = this._user?.token;
    this.rest.unauthorized.subscribe(() => this.unauthorize());
  }

  get user(): AuthModel | null { return this._user; }
  set user(user: AuthModel | null) {
    this._user = user;
    this.rest.token = this._user?.token;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }

   // General auth check
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const guardMethod = route.data['guardMethod'];

    if (guardMethod === 'canActivateAdmin') {
      return this.canActivateAdmin(route, state);
    }

    return this.user !== null;
  }

  // Check if user is authenticated and has admin role
  canActivateAdmin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.user !== null && this.user.role === 'ADMIN') {
      return true;
    } else {
      // Redirect to error page or login if user is not an admin
      return this.router.createUrlTree(['/error']); // or you can use `/login`
    }
  }

  unauthorize(): void {
    this.user = null;
    if (location.pathname !== '/login' && location.pathname !== '/resetpw') {
      this.router.navigateByUrl('/login');
    }
  }
}
