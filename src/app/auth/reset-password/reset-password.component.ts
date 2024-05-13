import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RestApi } from '../../shared/rest-api';
import { AuthGuard } from '../auth.guard';
import { PasswordValidator } from '../../shared/validator/passwordValidator';
import { Alert } from 'src/app/shared/alert/alert';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  form = this.fb.group({});
  busy = false;
  resetKey = '';
  hide = true;
  hide2 = true;
  sub?: Subscription;
  pwPolicy = new PasswordValidator(this.rest);
  constructor(private rest: RestApi, private route: ActivatedRoute, private router: Router, private fb: FormBuilder,public auth: AuthGuard, private alert: Alert) {
    this.route.queryParams.subscribe((params: any) => this.resetKey = params.key || '');

    this.rest.get(`api/resetpw?key=${this.resetKey}`, {silent: true}).subscribe(res => {
      console.log(res);
    }, err => {
      if(err.message === 'That reset link has expired.') {
        this.router.navigateByUrl('/login');
        this.alert.error('ลิงก์รีเซ็ตรหัสผ่านถูกใช้งานไปเรียบร้อยแล้ว')
      }
    });


    if(localStorage.getItem('transcript-portal')) {
      this.rest.delete('session', { silent: true }).subscribe();
      this.auth.unauthorize();
    }

    // this.form = this.fb.group({
    //   password: ['', [Validators.required, this.pwPolicy.minlengthCheckValidator(),
    //                  this.pwPolicy.minletterCheckValidator(), this.pwPolicy.minNumberCheckValidator(),
    //                  this.pwPolicy.minletterUpperCheckValidator(), this.pwPolicy.minSpecialCheckValidator()]],
    //   confirmPassword: ['', Validators.required]
    // }, {validators: [this.checkPasswords]});
  


  }

  ngOnInit(): void {
    document.body.classList.add('full-authen');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('full-authen');
  }

  reset(): void {
    if (this.form.valid) {
      this.busy = true;
      // this.rest.post(`api/resetpw?key=${this.resetKey}`, this.form.value.password)
      //   .subscribe(() => this.router.navigateByUrl('/login')).add(() => this.busy = false);
    }
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    return pass === confirmPass ? null : { notSame: true }
  }
  
}
