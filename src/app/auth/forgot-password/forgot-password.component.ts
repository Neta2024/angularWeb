import { Component, HostBinding, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alert } from 'src/app/shared/alert/alert';
import { RestApi } from '../../shared/rest-api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  @HostBinding() className = 'app-change-password';
  busy = false;
  username = '';

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private rest: RestApi, private dialogRef: MatDialogRef<ForgotPasswordComponent>, private alert: Alert) {
    if (data.username) {
      this.username = data.username;
    }
  }

  reset(): void {
    this.busy = true;
    this.rest.post('/api/forgotpw', this.username)
    .subscribe( data => {
      this.dialogRef.close();
      this.alert.success("หากมีชื่อผู้ใช้ของคุณอีเมลจะถูกส่งพร้อมคำแนะนำเพิ่มเติม");
      this.busy = false;
    });
  }
}
