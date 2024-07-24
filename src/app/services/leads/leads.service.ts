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
    return this.http.get('http://localhost:4000/api/master/candidates');
  }

  getLeadById(id:any){
    return this.http.get(`http://localhost:4000/api/master/candidates/${id}`);
  }

  createLead(data:any){
    return this.http.post("http://localhost:4000/api/master/candidates",data);
  }

  deleteLeadById(id:any){
    return this.http.delete(`http://localhost:4000/api/master/candidates/${id}`);
  }

  updateLeadById(id: any, data: any) {
    return this.http.put(`http://localhost:4000/api/master/candidates/${id}`, data);
  }

  langFilter(lang:any,proficiencyLevels: any){
    console.log("This is lang: ",lang)
    console.log("This is profi: ",proficiencyLevels)
    return this.http.get(`http://localhost:4000/api/master/langfilter?lang=${lang}&proficiencyLevel=${proficiencyLevels}`);
  }

  // updating recruiter
  updateLead(lead:any): Observable<any> {
    return this.http.put<any>(`https://recrutory-crm-backend.onrender.com/api/crm/leads/${lead.id}`, lead);
  }

  // getting list of assign process 
  getProcessList(){
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/client/process-options');
  }

  //adding candidate in process
  addProcessMultipleCandidate(data: any){
    return this.http.post('https://recrutory-crm-backend.onrender.com/api/master/candidates/assign-process',data);
  }

  // updateLeadById(id:any){
  //   return this.http.put(`http://localhost:4000/lead/leads/${id}`);
  //   return this.http.put(`https://backendapi-1-nlyi.onrender.com/api/lead/leads/${id}`);
  // }
  

}
