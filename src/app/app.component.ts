import { Subscription } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RestApi } from './shared/rest-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSidenav) sideNav!: MatSidenav;
  showToolbar = true;
  showSideNav = false;

  constructor(private rest: RestApi, private router: Router) {
    
  }

  logout() {
    console.log("Log Out");
    this.rest.unauthorized.next(true);
    // this.rest.delete('/auth').subscribe(user => {
    //   this.router.navigateByUrl('/login');
    // });
  }

}
