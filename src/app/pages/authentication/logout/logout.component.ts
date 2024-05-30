import { Component, OnInit } from '@angular/core';
import { RestApi } from 'src/app/shared/rest-api';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private rest: RestApi, private authGuard: AuthGuard) { }

  ngOnInit() {
  }

  logout(){
    console.log("Log out");
    this.rest.delete('auth/logout', { silent: true }).subscribe();
    this.authGuard.unauthorize();
  }
}
