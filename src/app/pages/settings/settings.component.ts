import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  employeeName: string = 'John Doe';
  employeeEmail: string = 'john.doe@example.com';
  employeeRole: string = 'Admin';

  logout(): void {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
    this.snackBar.open('Logged out successfully ...', 'Close', {
      duration: 1000,
      panelClass: ['logout-snackbar']
    });
  }
}
