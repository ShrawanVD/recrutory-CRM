import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userRole: any;
  constructor(private router: Router, private snackBar: MatSnackBar,private loginService: LoginService) { }

  ngOnInit(): void {
    this.userRole =this.loginService.getRole();
   }

  // employeeName: any = this.userRole;
  // employeeEmail: string = 'john.doe@example.com';
  // employeeRole: any =  this.userRole;

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("recruiter");
    this.router.navigate(['/login']);
    this.snackBar.open('Logged out successfully ...', 'Close', {
      duration: 1000,
      panelClass: ['logout-snackbar']
    });
  }
}
