import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private token: string = '';
  private role: string = '';
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  url = "https://recrutory-crm-backend.onrender.com/api";

  constructor(public http:HttpClient,private router: Router) { }

  login(data: any) {
    console.log(data)
    return this.http
      .post(`${this.url}/login`, data)
      .subscribe((result: any) => {
        console.log("result:",result);
        localStorage.setItem('token', result.token);
        localStorage.setItem('role',result.role)
        this.isUserLoggedIn.next(true);
        this.router.navigate(['/dashboard/client']);
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

  getRole(){
    return this.role || localStorage.getItem('role');
  }

  // isAdmin(): boolean {
  //   return this.getRole() === 'admin';
  // }
  
  // isTeamLead(): boolean {
  //   return this.getRole() === 'teamlead';
  // }
  
  // isRecruiter(): boolean {
  //   return this.getRole() === 'recruiter';
  // }

}
