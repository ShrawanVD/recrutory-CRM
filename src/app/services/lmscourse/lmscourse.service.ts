import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.module';

@Injectable({
  providedIn: 'root'
})
export class LmscourseService {
  private apiUrl = 'https://backendapi-1-nlyi.onrender.com/api/courses';

  constructor(private http: HttpClient) {}

  createCourse(course: any): Observable<any> {
    return this.http.post(this.apiUrl, course);
  }

  // getCourses(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
}
