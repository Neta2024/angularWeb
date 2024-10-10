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
  userRole: string = ''; // Default to 'USER'
  isAdminMode: boolean = false; // Tracks whether admin mode is enabled
  isAdminModeVisible: boolean = false; // Visibility of the admin switch
  greeting: string = '';

  private userSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.setGreeting();  // Set greeting on initialization
    const currentUser = this.authService.getAuthFromLocalStorage(); // Fetch the current user from local storage
    if (currentUser) {
      this.userFullName = currentUser.firstName + ' ' + currentUser.lastName;
      this.userEmail = currentUser.email;
      this.userRole = currentUser.role.toUpperCase();
      // this.isAdminModeVisible = this.userRole === 'ADMIN'; // Show switch if initially ADMIN
      this.isAdminMode = false;
    } else {
      this.userFullName = 'Guest';
      this.userRole = 'No Role';
    }
  }

   // Method to determine the greeting based on current time
   setGreeting(): void {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  // Toggle between admin and user mode
  toggleAdminMode(): void {
    if (this.isAdminMode && this.isAdminModeVisible) {
      this.userRole = 'ADMIN'; // When the switch is turned on
        // Save the new state to localStorage
      localStorage.setItem('isAdminMode', JSON.stringify(this.isAdminMode));
    } else {
      this.userRole = 'USER'; // When the switch is turned off
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
