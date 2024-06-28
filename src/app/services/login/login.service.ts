import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token: string = '';
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  url = "https://backendapi-1-nlyi.onrender.com";

  constructor(public http:HttpClient,private router: Router) { }

  login(data: any) {
    console.log(data)
    return this.http
      .post(`${this.url}/login`, data)
      .subscribe((result: any) => {
        localStorage.setItem('token', result.token);
        this.isUserLoggedIn.next(true);
        this.router.navigate(['/dashboard/blogs']);
      });
  }

  profile() {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http
      .post(
      `${this.url}/profile`,
        {},
        { headers }
      )
      .subscribe((result: any) => {
        
      }, (error: any) => {
       console.log(error);
      });
  }

  getToken(){
    return this.token || localStorage.getItem('token');
  }

}
