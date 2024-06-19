import { Component } from '@angular/core';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  passwordFieldType: string = 'password'; // Initialize with 'password'
  password: string = ''; // Initialize the password model

  constructor(private loginService: LoginService){}

  userLogin(data:any){
    this.loginService.login(data);
  }

}
