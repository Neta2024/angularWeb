import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSidenav) sideNav!: MatSidenav;
  showToolbar = true;
  showSideNav = false;



  logout() {
    throw new Error('Method not implemented.');
  }

}
