import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminModeService {
  private isAdminMode: boolean = false;

  // Method to get admin mode status
  getAdminMode(): boolean {
    return this.isAdminMode;
  }

  // Method to set admin mode status
  setAdminMode(isAdmin: boolean) {
    this.isAdminMode = isAdmin;
  }
}
