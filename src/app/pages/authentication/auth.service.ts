import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthModel } from './model/auth.model';
import { RestApi } from 'src/app/shared/rest-api';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = 'ginkgorun';
  private authCurrentCompany = 'default';

  // public fields
  currentUser$: Observable<AuthModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<AuthModel>;
  isLoadingSubject: BehaviorSubject<boolean>;
  isSysAdmin: boolean = false;
  currentUser?: AuthModel;

  get currentUserValue(): AuthModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: AuthModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private rest: RestApi,
    private router: Router,
    private msalService: MsalService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<AuthModel>(new AuthModel());
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.msalService.initialize();
    this.msalService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window

  }

  login(username: string, pwd: string): Observable<AuthModel> {
    this.isLoadingSubject.next(true);
    const authorization = btoa(`${encodeURIComponent(username)}:${encodeURIComponent(pwd)}`);
    const headers = new HttpHeaders().set('Authorization', `Basic ${authorization}`);
    return this.rest.post('/auth/login', null, { headers }).pipe(
      map((auth: AuthModel) => {
        //console.log(auth);
        this.setAuthToLocalStorage(auth);
        return auth;
      }),
      catchError((err) => {
        return of(err);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  entraIdLogin(data: any): Observable<AuthModel> {
    this.isLoadingSubject.next(true);

    return this.rest.post('/auth/login/entra', data).pipe(
      map((auth: AuthModel) => {
        //console.log(auth);
        return this.setAuthToLocalStorage(auth);
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        return of(err);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  
  logoutService() {
    const auth = this.getAuthFromLocalStorage();
    if(!auth || !auth.userToken){
      this.router.navigate(['/']);
      return;
    } 
    this.rest.post('/auth/logout', auth.userToken)
      .subscribe(data => {
        //console.log(data);
        localStorage.removeItem(this.authLocalStorageToken);
        localStorage.clear();
        //this.router.navigate(['/auth/login']);
        document.location.reload();
        return data;
      });
  }

  logout(param?: any){
    const auth = this.getAuthFromLocalStorage();
    //console.log(auth);
    if(!auth || !auth.userToken) {
      this.router.navigate(['login']);
      //document.location.reload();
      return;
    }

    if (auth.authMethod == 'Google') {
      //console.log("Sign out google..");
      this.logoutService();
      //this.router.navigate(['login']);
    }
    else if(auth.authMethod == 'EntraID' || auth.authMethod == 'EntraIDNoIdp'){
      console.log("Sign out EntraID..");
      this.msalService.logoutRedirect({ account: this.msalService.instance.getActiveAccount() })
      .subscribe((res)=>{
        this.logoutService();
        //this.router.navigate(['login']);
      });
    }
    else {
      this.logoutService();
      //this.router.navigate(['login']);
    }
  }

  getUserByToken(): Observable<AuthModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.userToken) {
      //console.log("No Token..");
      return of(undefined);
    }
    //console.log(auth);
    this.isLoadingSubject.next(true);
    return this.rest.post('/auth/token', auth.userToken).pipe(
      map((user: AuthModel) => {
        if (user) {
          //console.log(user);
          this.currentUserSubject = new BehaviorSubject<AuthModel>(user);
          if(localStorage.getItem(this.authCurrentCompany) == null){
            //console.log(cur);
            localStorage.setItem(this.authCurrentCompany, JSON.stringify(user));
          }
          //console.log([user]);
          this.currentUser = user;
          //console.log(this.currentUser);
        } else {
          this.logout();
        }
        return user;
      }),
      catchError((err) => {
        console.error('err', err);
        this.logout();
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.rest.post('/auth/forgot', email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  public setAuthToLocalStorage(auth: AuthModel): boolean {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.token) {
      //console.log([JSON.stringify(auth)]);
      //localStorage.setItem(this.authLocalStorageToken, this.AES.encrypt(JSON.stringify(auth)));

      return true;
    }

    return false;
  }

  public getAuthFromLocalStorage(): AuthModel {
    try {
      return JSON.parse(localStorage.getItem(this.authLocalStorageToken));
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  
}
