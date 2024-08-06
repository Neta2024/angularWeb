import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { AlertComponent } from './alert.component';

@Injectable({ providedIn: 'root' })
export class Alert {
   constructor(private snackBar: MatSnackBar) { }

   info(message: string, duration?: number): MatSnackBarRef<AlertComponent> {
      return this.show(message, 'info', duration);
   }

   success(message: string, duration?: number): MatSnackBarRef<AlertComponent> {
      return this.show(message, 'success', duration);
   }

   warn(message: string, duration?: number): MatSnackBarRef<AlertComponent> {
      return this.show(message, 'warn', duration);
   }

   error(message: string, duration?: number): MatSnackBarRef<AlertComponent> {
      return this.show(message, 'error', duration);
   }

   show(message: string, type?: string, duration?: number): MatSnackBarRef<AlertComponent> {
      if (duration === undefined) {
         duration = message.length * 100;
      }
      if (duration > 0 && duration < 1500) {
         duration = 1500;
      } else if (duration > 10000) {
         duration = 10000;
      }

      const config: MatSnackBarConfig = {
         data: { type, message },
         duration,
         announcementMessage: message,
         verticalPosition: 'top'
      };
      return this.snackBar.openFromComponent(AlertComponent, config);
   }

   dismiss(): void {
      this.snackBar.dismiss();
   }
}
