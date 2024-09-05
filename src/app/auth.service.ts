import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private intervalId: any; // Interval ID to manage interval clearing

  constructor(private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  getToken(): string | null {
    return localStorage.getItem('token'); // or sessionStorage.getItem('token')
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = tokenPayload.exp * 1000; // convert to milliseconds
    return Date.now() > expiryTime; // true if expired, false if not
  }

  // Method to handle user logout
  logout(): void {
    // Clear interval to stop further checks
    this.stopTokenExpiryCheck();
    
    // Close all open dialogs
    this.dialog.closeAll(); // Close all dialogs upon logout

    // Remove token
    localStorage.removeItem('token'); // or sessionStorage.removeItem('token')

    // Only show the snackbar if the user is NOT already on the login page
    if (this.router.url !== '/login') {
      this.snackBar.open('Session expired. Please log in again.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
    }
  }

  // Periodically called method to check if the session is valid
  checkSessionValidity(): void {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  // Start the token expiry check interval
  startTokenExpiryCheck(): void {
    if (!this.intervalId) { // Only start if there isn't already an interval running
      this.intervalId = setInterval(() => {
        this.checkSessionValidity();
      }, 5000); // Check every 5 seconds
    }
  }

  // Stop the token expiry check interval
  stopTokenExpiryCheck(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
