import { AuthService } from './../auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-main',
  templateUrl: './auth-main.component.html',
  styleUrls: ['./auth-main.component.css']
})
export class AuthMainComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(private auth: AuthService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    const sb = this.auth.isLoading$.subscribe(res => {
      res ? this.spinner.show() : this.spinner.hide();
    });;
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
