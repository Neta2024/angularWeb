import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RestApi } from '../../shared/rest-api';
import { PasswordValidator } from '../../shared/validator/passwordValidator';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnDestroy {

  form = this.fb.group({})
  hide = true;
  hide2 = true;
  hide3 = true;
  busy = false;
  sub?: Subscription;
  pwPolicy = new PasswordValidator(this.rest);
  constructor(private fb: FormBuilder, private rest: RestApi, private dialogRef: MatDialogRef<ChangePasswordComponent>) { 
    // this.form = this.fb.group({
    //   oldPassword: ['', Validators.required],
    //   newPassword: ['', [Validators.required, this.pwPolicy.minlengthCheckValidator(),
    //     this.pwPolicy.minletterCheckValidator(), this.pwPolicy.minNumberCheckValidator(),
    //     this.pwPolicy.minletterUpperCheckValidator(), this.pwPolicy.minSpecialCheckValidator()]],
    //   confirmPassword: ['', Validators.required]}, {validators: [this.checkPasswords, this.checkOldPasswords]});

    // this.form.setValidators([this.checkPasswords, this.checkOldPasswords]);
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  change(): void {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      this.busy = true;
      this.rest.post('/changepw', this.form.value)
      .subscribe(() => {
        this.dialogRef.close(true);
      }, err => {
        if(err.message === 'Invalid password') {
          //this.form.controls.oldPassword.setErrors({invalid: true});
        }
      }).add(() => this.busy = false);
    }
  }

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('newPassword')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  checkOldPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('oldPassword')?.value;
    let confirmPass = group.get('newPassword')?.value
    return pass === confirmPass && pass !== '' && confirmPass !== '' ? { sameOld: true } : null;
  }

}
