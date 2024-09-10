import { Component, OnInit } from '@angular/core';
import { RestApi } from 'src/app/shared/rest-api';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private rest: RestApi, private authGuard: AuthGuard, private authService: AuthService) { }

  ngOnInit() {
  }

  logout(){
    console.log("Log out");
    this.authGuard.unauthorize();
    this.authService.logout();
    this.rest.delete('auth/logout', { silent: true }).subscribe();
  }
}
