import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert } from 'src/app/shared/alert/alert';
import { RestApi } from 'src/app/shared/rest-api';
import { AuthGuard } from '../auth.guard';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding() className = 'app-change-password';
  busy = false;
  form: FormGroup;
  popState?: Subscription;

  constructor(private fb: FormBuilder, private rest: RestApi, private auth: AuthGuard, private router: Router, private dialog: MatDialog, private alert: Alert) {
    if (this.auth.user) {
      this.router.navigateByUrl('/main');
    }

    this.awarenessPopState();
    this.form = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit(): void {
    document.body.classList.add('mat-background');
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
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

  login(): void {
    if (this.form.invalid) {
      return;
    }
    this.busy = true;
    const username = this.form.value.username;
    const pass = this.form.value.password;
    const authorization = btoa(`${encodeURIComponent(username)}:${encodeURIComponent(pass)}`);
    const headers = new HttpHeaders().set('Authorization', `Basic ${authorization}`);
    this.rest.post('/login', null, { headers }).subscribe(user => {

      console.log(user);
      this.auth.user = user;
      this.router.navigateByUrl('/main');
      // if(user.lastPasswordChange === undefined){
      //   const dialogRef = this.dialog.open(ChangePasswordComponent, { disableClose: true });
      //   dialogRef.afterClosed().subscribe((result) => {
      //     if(result) {
      //       this.auth.user = user;
      //       this.router.navigateByUrl('/main');
      //     } else {
      //       setTimeout(() => { this.auth.unauthorize()}, 500);
      //     }
      //   });
      // }else{
      //   this.auth.user = user;
      //   this.router.navigateByUrl('/main');
      // }

    }).add(() => this.busy = false);
  }

  forgot(): void {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, { data: this.form.value });
  }
}
