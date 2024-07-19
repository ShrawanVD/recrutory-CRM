import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordFieldType: string = 'password'; // Initialize with 'password'
  password: string = ''; // Initialize the password model

  constructor(private loginService: LoginService,  private snackBar: MatSnackBar){}

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  userLogin(data: any): void {
    this.loginService.login(data).subscribe(
      (result: any) => {
        this.snackBar.open('Logged in successfully ...', 'Close', { duration: 1000 });
      },
      (error: any) => {
        if (error.status === 401) {
          this.snackBar.open('Incorrect username or password', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('An error occurred. Please try again later.', 'Close', { duration: 3000 });
        }
      }
    );
  }



}
