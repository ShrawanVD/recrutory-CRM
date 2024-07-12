import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CilentService {

  constructor(private http:HttpClient) { }

  getAllClient(){
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/client/clients');
  }

  addClient(data: any){
    return this.http.post('https://recrutory-crm-backend.onrender.com/api/client/create',data);
  }

  updateClientById(clientId: any,data: any){
    return this.http.put(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}`,data)
  }

  deleteClient(clientId: any){
    return this.http.delete(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}`);
  }

  getAllProcess(){
    return this.http.get('https://recrutory-crm-backend.onrender.com/api/client/clients/processes');
  }

  getClientById(clientId: any){
    return this.http.get(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}`);
  }

  getProcessById(clientId:any,processId:any){
    return this.http.get(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}/process/${processId}`);
  }

  addProcess(clientId: any,data: any){
    return this.http.post(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}/process/`,data);
  }

  deleteProcess(clientId: any,processId: any){
    return this.http.delete(`https://recrutory-crm-backend.onrender.com/api/client/clients/${clientId}/process/${processId}`);
  }

}
