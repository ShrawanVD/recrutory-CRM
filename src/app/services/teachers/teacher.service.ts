import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  
  constructor(public http:HttpClient) { }

  url = "https://backendapi-1bfa.onrender.com";

  getAllTeacher(){
    return this.http.get(`${this.url}/api/teachers`);
  }

  patchBlogs(id:any,data:any){
    return this.http.patch(`${this.url}/api/teachers/${id}`,data);
  }
}
