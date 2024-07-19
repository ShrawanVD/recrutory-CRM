import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CilentService {

  constructor(private http: HttpClient) { }

  //client services starts from here
  getAllClient() {
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/client/clients');
  }

  addClient(data: any) {
    return this.http.post('https://recrutory-crm-backend.onrender.com/api/client/create', data);
  }

  updateClientById(clientId: any, data: any) {
    return this.http.put(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}`, data)
  }

  deleteClient(clientId: any) {
    return this.http.delete(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}`);
  }

  // process services starts from here
  getAllProcess() {
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/client/clients/processes');
  }

  getClientById(clientId: any) {
    return this.http.get(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}`);
  }

  getProcessById(clientId: any, processId: any) {
    return this.http.get(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}/process/${processId}`);
  }

  addProcess(clientId: any, data: any) {
    return this.http.post(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}/process/`, data);
  }

  updateProcess(clientId: any, processId: any, data: any) {
    return this.http.put(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}/processes/${processId}`, data);
  }

  deleteProcess(clientId: any, processId: any) {
    return this.http.delete(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}/process/${processId}`);
  }

  // get Recruiter using role
  getRecruiter(data:any){
    return this.http.get(`https://recrutory-crm-backend.onrender.com/api/users-by-role?role=${data}`);
  }

  // updating recruiter in filtersheet by passing array of candidate
  updateMultipleRecruiter(clientId: any, processId: any,data: any) {
    return this.http.put(`https://recrutory-crm-backend.onrender.com/api/client/clients/assign-recruiter/${clientId}/${processId}`, data);
  }

  // updating candidate in filtered table which also reflect in mastersheet
  updateFilteredCandidate(clientId: any, processId: any, candidateId: any, data: any){
    return this.http.put(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}/processes/${processId}/candidates/${candidateId}`,data);
  } 

  // get for selected candidate sheet
  getSelectCandidate(){
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/client/selected-candidates');
  }

}
