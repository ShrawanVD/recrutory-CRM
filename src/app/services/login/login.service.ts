import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private token: string = '';
  private role: string = '';
  private recruiterId: any;
  private username: any;
  
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  
  url = 'https://recrutory-crm-backend-iwf1.onrender.com/api';

  constructor(public http: HttpClient, private router: Router) { }

  login(data: any) {
    return this.http.post(`${this.url}/login`, data).pipe(
      tap((result: any) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('recruiter', result._id);
        localStorage.setItem('username',result.username);
        this.isUserLoggedIn.next(true);
        this.router.navigate(['/dashboard/client']);
      })
    );
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

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  getRole() {
    return this.role || localStorage.getItem('role');
  }

  getRecruiterId(){
    return this.recruiterId || localStorage.getItem('recruiter');
  }

  getUsername(){
    return this.username || localStorage.getItem('username');
  }

  //Role specific api  Recruiter
  getCandidateByRecruiterId(){
    console.log("recruiter id is: " + this.getRecruiterId());
    return this.http.get(`${this.url}/assigned-candidates?recruiterId=${this.getRecruiterId()}`);
  }

  getFilteredCanByRecruiterId(lang: any,proficiencyLevels: any){
    if(lang && !proficiencyLevels){
      return this.http.get(`${this.url}/filterCandidateRecruiter?recruiterId=${this.getRecruiterId()}&lang=${lang}`);
    }
  else if(!lang && proficiencyLevels){
    return this.http.get(`${this.url}/filterCandidateRecruiter?recruiterId=${this.getRecruiterId()}&proficiencyLevel=${proficiencyLevels}`);
    }
    else{
      return this.http.get(`${this.url}/filterCandidateRecruiter?recruiterId=${this.getRecruiterId()}&lang=${lang}&proficiencyLevel=${proficiencyLevels}`);
    }
  }

  // update status of interested or not interested
  updateInterested(data: any){
    return this.http.put(`${this.url}/update-status`,data)
  }

  // api for adding new user with their role
  registerUser(data:any){
    return this.http.post(`${this.url}/register`,data);
    // return this.http.post(`http://localhost:4000/api/register`,data);
  }
 
  getAllUsers(){
    return this.http.get(`${this.url}/users`)
    // return this.http.get(`http://localhost:4000/api/users`)
  }
 
  deleteUser(id: any){
    return this.http.delete(`${this.url}/users/${id}`)
    // return this.http.delete(`http://localhost:4000/api/users/${id}`)
  }
 
  editUser(id: any, data: any) {
    return this.http.put(`${this.url}/users/${id}`, data);
    // return this.http.put(`http://localhost:4000/api/users/${id}`, data);
  }



  // granting permissions on role 
  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
  
  isTeamLead(): boolean {
    return this.getRole() === 'Team Lead';
  }
  
  isRecruiter(): boolean {
    return this.getRole() === 'Recruiter';
  }

  isHr(): boolean{
    return this.getRole() === 'HR';
  }

}


// export class LoginService {
//   private token: string = '';
//   private role: string = '';
//   isUserLoggedIn = new BehaviorSubject<boolean>(false);
//   url = "https://recrutory-crm-backend.onrender.com/api";

//   constructor(public http:HttpClient,private router: Router) { }

//   login(data: any) {
//     return this.http
//       .post(`${this.url}/login`, data)
//       .subscribe((result: any) => {
//         console.log("result:",result);
//         localStorage.setItem('token', result.token);
//         localStorage.setItem('role',result.role)
//         this.isUserLoggedIn.next(true);
//         this.router.navigate(['/dashboard/client']);
//       });
//   }

//   profile() {
//     let headers = new HttpHeaders().set(
//       'Authorization',
//       `Bearer ${localStorage.getItem('token')}`
//     );
//     return this.http
//       .post(
//       `${this.url}/profile`,
//         {},
//         { headers }
//       )
//       .subscribe((result: any) => {
        
//       }, (error: any) => {
//        console.log(error);
//       });
//   }

//   getToken(){
//     return this.token || localStorage.getItem('token');
//   }

//   getRole(){
//     return this.role || localStorage.getItem('role');
//   }

 

  


// }