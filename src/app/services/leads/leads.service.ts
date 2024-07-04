import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LeadsService {

  constructor(public http:HttpClient) { }

  getAllLeads(){
    // return this.http.get('http://localhost:4000/lead/leads');
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/crm/leads');
  }

  getLeadById(id:any){
    // return this.http.get(`hhttp://localhost:4000/lead/leads/${id}`);
    return this.http.get(`https://recrutory-crm-backend.onrender.com/api/crm/leads/${id}`);
  }

  createLead(data:any){
    // return this.http.post("http://localhost:4000/lead/create",data);
    return this.http.post("https://recrutory-crm-backend.onrender.com/api/crm/create",data);
  }

  deleteLeadById(id:any){
    // return this.http.delete(`http://localhost:4000/lead/leads/${id}`);
    return this.http.delete(`https://recrutory-crm-backend.onrender.com/api/crm/leads/${id}`);
  }

  updateLeadById(id: any, data: any) {
    // return this.http.put(`http://localhost:4000/lead/leads/${id}`, data);
    return this.http.put(`https://recrutory-crm-backend.onrender.com/api/crm/leads/${id}`, data);
  }
  
  // updateLeadById(id:any){
  //   return this.http.put(`http://localhost:4000/lead/leads/${id}`);
  //   return this.http.put(`https://backendapi-1-nlyi.onrender.com/api/lead/leads/${id}`);
  // }
  

}
