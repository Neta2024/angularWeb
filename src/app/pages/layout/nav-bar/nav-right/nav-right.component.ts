// Angular import
import { Component, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from 'src/app/pages/authentication/auth.service';  // Update the path as needed
import { AuthModel } from 'src/app/pages/authentication/model/auth.model'; // Update the path as needed
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit, OnDestroy{
  userFullName: string = '';
  userEmail: string = '';
  department: string = ''
  userRole: string = '';

  private userSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getAuthFromLocalStorage(); // Fetch the current user from local storage
    if (currentUser) {
      this.userFullName = currentUser.firstName + ' ' + currentUser.lastName;
      this.userEmail = currentUser.email;
      this.userRole = currentUser.role.toUpperCase();
    } else {
      this.userFullName = 'Guest';
      this.userRole = 'No Role';
    }
  }

  onLogout() {
    this.authService.logout(); // Handle the logout process
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
