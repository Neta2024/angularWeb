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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.user !== null;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }

  unauthorize(): void {
    this.user = null;
    if (location.pathname !== '/login' && location.pathname !== '/resetpw') {
      this.router.navigateByUrl('/login');
    }
  }
}
