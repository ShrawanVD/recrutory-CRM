import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'https://lms-backend-3nru.onrender.com/api/lessons';
  // 'https://lms-backend-3nru.onrender.com/api/courses'
  constructor(private http: HttpClient) { }

  getLessons(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addLesson(lesson: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, lesson);
  }

  updateLesson(id: string, lesson: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, lesson);
  }
}
