import { Component, Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface ConfirmationTitle {
   color?: string;
   icon?: string;
   text: string;
}

export interface AcceptButton {
   color?: string;
   label: string;
   action?: (dialogRef: MatDialogRef<ConfirmationComponent>) => boolean;
   complete?: (result: any) => void;
   observable?: Observable<any>;
}

export interface ConfirmationData {
   title?: ConfirmationTitle | string;
   message: string;
   contentClass?: string;
   accept?: AcceptButton | string;
   close?: string;
   disableClose?: boolean;
}

@Component({
   selector: 'app-confirmation',
   templateUrl: './confirmation.component.html',
   styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {
   titleColor: string;
   titleIcon: string;
   titleText: string;
   contentClass: string;
   acceptColor: string;
   acceptLabel: string;
   busy = false;

   constructor(private dialogRef: MatDialogRef<ConfirmationComponent>,
               @Inject(MAT_DIALOG_DATA) public options: ConfirmationData) {
      this.titleColor = typeof this.options.title === 'string' ? '' : this.options.title?.color || '';
      this.titleIcon = typeof this.options.title === 'string' ? '' : this.options.title?.icon || '';
      this.titleText = typeof this.options.title === 'string' ? this.options.title : this.options.title?.text || '';
      this.contentClass = this.options.contentClass || '';
      this.acceptColor = typeof this.options.accept === 'string' ? '' : this.options.accept?.color || 'accent';
      this.acceptLabel = typeof this.options.accept === 'string' ? this.options.accept : this.options.accept?.label || '';
   }

   accept(): void {
      this.busy = true;
      if (typeof this.options.accept === 'string') {
         this.dialogRef.close(true);
      } else if (this.options.accept?.observable) {
         this.options.accept?.observable.subscribe((result: any) => this.complete(result), () => this.close());
      } else if (this.options.accept?.action) {
         if (this.options.accept?.action(this.dialogRef)) {
            this.complete();
         } else {
          this.busy = false;
         }
      } else {
         this.complete();
      }
   }

   close(): void {
      this.dialogRef.close();
   }

   private complete(result?: any): void {
      this.dialogRef.close(result || true);
      const accept = this.options.accept as AcceptButton;
      if (accept.complete) {
         accept.complete(result);
      }
   }
}

@Injectable({ providedIn: 'root' })
export class Confirmation {
   constructor(private dialog: MatDialog) { }

   info(options: ConfirmationData): MatDialogRef<ConfirmationComponent> {
      return this.open(options, '', 'info', 'primary');
   }

   success(options: ConfirmationData): MatDialogRef<ConfirmationComponent> {
      return this.open(options, 'success', 'check_circle_outline', 'primary');
   }

   warn(options: ConfirmationData): MatDialogRef<ConfirmationComponent> {
      if (typeof options.accept === 'object') {
        options.accept.color = 'warn';
      }
      return this.open(options, 'warn', 'warning_amber', 'warn');
   }

   private open(options: ConfirmationData, color: string, icon: string, acceptColor: string): MatDialogRef<ConfirmationComponent> {
      if (typeof options.title === 'string') {
         options.title = { text: options.title };
      }
      if (options.title) {
         if (!options.title.color) {
            options.title.color = color;
         }
         if (!options.title.icon) {
            options.title.icon = icon;
         }
      }
      if (typeof options.accept === 'string') {
         options.accept = { label: options.accept };
      }
      if (options.accept && !options.accept.color) {
         options.accept.color = acceptColor;
      }
      if (!options.close) {
         options.close = options.accept ? 'ยกเลิก' : 'ปิด';
      }
      const disableClose = options.disableClose !== undefined ? options.disableClose : options.accept !== undefined;
      return this.dialog.open(ConfirmationComponent, { disableClose, data: options });
   }
}
