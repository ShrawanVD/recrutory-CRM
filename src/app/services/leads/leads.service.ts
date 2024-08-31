import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LeadsService {

  url = "https://recrutory-crm-backend-iwf1.onrender.com"
  // url = "http://localhost:4000"


  constructor(public http:HttpClient) { }


  // mastersheet api 
  getAllLeads(){
    return this.http.get(`${this.url}/api/master/candidates`);
  }

  getLeadById(id:any){
    return this.http.get(`${this.url}/api/master/candidates/${id}`);
  }

  // createLead(data:any){
  //   return this.http.post(`${this.url}/api/master/candidates`,data);
  // }

  createLead(data: any) {
    const token = localStorage.getItem('token'); // Get the token from localStorage (or wherever it is stored)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.url}/api/master/candidates`, data, { headers });
  }

  deleteLeadById(id:any){
    return this.http.delete(`${this.url}/api/master/candidates/${id}`);
  }

  updateLeadById(id: any, data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`)
    return this.http.put(`${this.url}/api/master/candidates/${id}`, data, {headers});
  }

  langFilter(lang:any,proficiencyLevels: any){
    if(lang && !proficiencyLevels){
      return this.http.get(`${this.url}/api/master/langfilter?lang=${lang}`);
    }
    else if(!lang && proficiencyLevels){
      return this.http.get(`${this.url}/api/master/langfilter?proficiencyLevel=${proficiencyLevels}`);
    }
    else{
      return this.http.get(`${this.url}/api/master/langfilter?lang=${lang}&proficiencyLevel=${proficiencyLevels}`);
    }
  }

  // updating recruiter
  updateLead(lead:any): Observable<any> {
    return this.http.put<any>(`${this.url}/api/crm/leads/${lead.id}`, lead);
  }

  // getting list of assign process 
  getProcessList(){
    return this.http.get(`${this.url}/api/client/process-options`);
  }

  //adding candidate in process
  addProcessMultipleCandidate(data: any){
    return this.http.post(`${this.url}/api/master/candidates/assign-process`,data);
  }

  // updateLeadById(id:any){
  //   return this.http.put(`http://localhost:4000/lead/leads/${id}`);
  //   return this.http.put(`https://backendapi-1-nlyi.onrender.com/api/lead/leads/${id}`);
  // }
  
  importFiles(data: any){
    return this.http.post(`${this.url}/api/master/candidate/import`,data);
  }
                            
}
