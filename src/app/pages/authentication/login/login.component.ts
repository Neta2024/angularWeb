import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, RedirectRequest, EventPayload, EventType } from '@azure/msal-browser';
import { EMPTY, Subscription, catchError, filter, of } from 'rxjs';
import { RestApi } from 'src/app/shared/rest-api';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';
import { Alert } from 'src/app/shared/components/alert/alert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  busy = false;
  form: FormGroup;
  popState?: Subscription;
  errorMessage: string;
  hasError: boolean;
  showPassword = false;

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msal: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private fb: FormBuilder, private rest: RestApi, private auth: AuthGuard, private router: Router,
    private authService: AuthService,
    private alert: Alert  // Inject the Alert service
  ) {

    const user = this.auth.user;
  
    // Check if the user is properly authenticated before redirecting
    if (user && user.token) {
      this.router.navigateByUrl('/timesheet/dashboard');
    }

    this.awarenessPopState();
    this.form = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });

    this.msal.handleRedirectObservable().subscribe();

    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS || msg.eventType === EventType.SSO_SILENT_SUCCESS),
    )
    .subscribe((result: EventMessage) => {
      //console.log(result);
      if (this.msal.instance.getAllAccounts().length === 0) {
        window.location.pathname = "login";
      } else {
        //console.log(result.payload);
        this.checkAndSetActiveAccount();
        this.checkWithEntraId(result.payload);
      }
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('mat-background');
    this.popState?.unsubscribe();
  }

  awarenessPopState() {
    this.popState =  this.router.events.subscribe((res: any) => {
       if (res.navigationTrigger === 'popstate') {
         if(!this.auth.user) {
           this.router.navigateByUrl('/login');
         }
       }
   });
  }

  login(){
    console.log("Log In");
    //console.log(this.form);
    if (this.form.invalid) {
      return;
    }
    this.busy = true;
    const username = this.form.value.email;
    const pass = this.form.value.password;

    this.authService.login(username, pass)
    .pipe(catchError(err => {
      this.errorMessage = err;
      this.hasError = true;
      this.busy = false;
      //return undefined;
      this.alert.error(this.errorMessage);
      return of(err);
    }))
    .subscribe((res) => {
      this.busy = false;
      //console.log(res);
      if (res.message) {
        this.hasError = true;
        this.errorMessage = res.message;

        // Show error message if login fails
        this.alert.error(this.errorMessage);
      }
      else {
        this.hasError = false;

         // Show success message
         this.alert.success("Login successful!");

        this.auth.user = res;
        this.router.navigateByUrl('/timesheet/dashboard');
      }
    })
    .add(() => this.busy = false);
  }
  
  loginIdp(){
    console.log("Log In IDP");
    if (this.msalGuardConfig.authRequest) {
      this.msal.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.msal.loginRedirect();
    }
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.msal.instance.getActiveAccount();
    //console.log(activeAccount);
    if (!activeAccount && this.msal.instance.getAllAccounts().length > 0) {
      let accounts = this.msal.instance.getAllAccounts();
      this.msal.instance.setActiveAccount(accounts[0]);
    }
  }

  checkWithEntraId(payload: EventPayload) {
    console.log(payload);
    this.rest.post('/auth/login', payload).subscribe(user => {
      console.log(user);
      this.auth.user = user;
      this.router.navigateByUrl('/timesheet');
    }).add(() => this.busy = false);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
