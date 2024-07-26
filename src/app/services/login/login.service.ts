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
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  url = 'https://recrutory-crm-backend-yhnk.onrender.com/api';

  constructor(public http: HttpClient, private router: Router) { }

  login(data: any) {
    return this.http.post(`${this.url}/login`, data).pipe(
      tap((result: any) => {
        console.log("result:", result);
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
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
  //Role specific api  Recruiter
  getCandidatByRecruiterId(){
    return this.http.get(`${this.url}/assigned-candidates?recruiterId=66868b4a82d622656abd3873`);
  }

  getFilteredCanByRecruiterId(lang: any,proficiencyLevels: any){
    if(lang && !proficiencyLevels){
      return this.http.get(`${this.url}/filterCandidateRecruiter?recruiterId=66868b4a82d622656abd3873&lang=${lang}`);
    }
    else{
      return this.http.get(`${this.url}/filterCandidateRecruiter?recruiterId=66868b4a82d622656abd3873&lang=${lang}&proficiencyLevel=${proficiencyLevels}`);
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