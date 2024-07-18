import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LeadsService {

  constructor(public http:HttpClient) { }


  // mastersheet api 
  getAllLeads(){
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/master/candidates');
  }

  getLeadById(id:any){
    return this.http.get(`https://recrutory-crm-backend.onrender.com/api/master/candidates/${id}`);
  }

  createLead(data:any){
    return this.http.post("https://recrutory-crm-backend.onrender.com/api/master/candidates",data);
  }

  deleteLeadById(id:any){
    return this.http.delete(`https://recrutory-crm-backend.onrender.com/api/master/candidates/${id}`);
  }

  updateLeadById(id: any, data: any) {
    console.log(data)
    return this.http.put(`https://recrutory-crm-backend.onrender.com/api/master/candidates/${id}`, data);
  }

  // updating recruiter
  updateLead(lead:any): Observable<any> {
    return this.http.put<any>(`https://recrutory-crm-backend.onrender.com/api/crm/leads/${lead.id}`, lead);
  }

  // getting list of assign process 
  getProcessList(){
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/client/process-options');
  }

  // testing is remaing assignprocess and recruiter

  //adding candidate in process
  addProcessMultipleCandidate(data: any){
    return this.http.post('https://recrutory-crm-backend.onrender.com/api/master/candidates/assign-process',data);
  }

  // updateLeadById(id:any){
  //   return this.http.put(`http://localhost:4000/lead/leads/${id}`);
  //   return this.http.put(`https://backendapi-1-nlyi.onrender.com/api/lead/leads/${id}`);
  // }
  

}
