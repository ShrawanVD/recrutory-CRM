import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(public http: HttpClient) { }

  url = "https://backendapi-1bfa.onrender.com";

  getAllCuriotroyBlogs() {
    return this.http.get(`${this.url}/api/blogs`);
  }

  getCuriotroyBlogById(id: any) {
    return this.http.get(`${this.url}/api/blogs/${id}`);
  }
  postCuriotoryBlog(data: any) {
    return this.http.post(`${this.url}/api/blogs`, data);
  }

  patchCuriotoryBlog(id: any, data: any) {
    return this.http.patch(`${this.url}/api/blogs/${id}`, data);
  }

  deleteBlog(id: any) {
    return this.http.delete(`${this.url}/api/delete/blogs/${id}`);
  }
}
