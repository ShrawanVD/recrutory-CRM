import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CilentService {

  url = "https://recrutory-crm-backend-yhnk.onrender.com"

  constructor(private http: HttpClient) { }

  //client services starts from here
  getAllClient() {
    return this.http.get(`${this.url}/api/client/clients`);
  }

  addClient(data: any) {
    return this.http.post(`${this.url}/api/client/create`, data);
  }

  updateClientById(clientId: any, data: any) {
    return this.http.put(`${this.url}/api/client/clients/${clientId}`, data)
  }

  deleteClient(clientId: any) {
    return this.http.delete(`${this.url}/api/client/clients/${clientId}`);
  }

  // process services starts from here
  getAllProcess() {
    return this.http.get(`${this.url}/api/client/clients/processes`);
  }

  getClientById(clientId: any) {
    return this.http.get(`${this.url}/api/client/clients/${clientId}`);
  }

  getProcessById(clientId: any, processId: any) {
    return this.http.get(`${this.url}/api/client/clients/${clientId}/process/${processId}`);
  }

  addProcess(clientId: any, data: any) {
    return this.http.post(`${this.url}/api/client/clients/${clientId}/process/`, data);
  }

  updateProcess(clientId: any, processId: any, data: any) {
    return this.http.put(`${this.url}/api/client/clients/${clientId}/processes/${processId}`, data);
  }

  deleteProcess(clientId: any, processId: any) {
    return this.http.delete(`${this.url}/api/client/clients/${clientId}/process/${processId}`);
  }

  // get Recruiter using role
  getRecruiter(data:any){
    return this.http.get(`${this.url}/api/users-by-role?role=${data}`);
  }

  // updating recruiter in filtersheet by passing array of candidate
  updateMultipleRecruiter(clientId: any, processId: any,data: any) {
    return this.http.put(`${this.url}/api/client/clients/assign-recruiter/${clientId}/${processId}`, data);
  }

  // updating candidate in filtered table which also reflect in mastersheet
  updateFilteredCandidate(clientId: any, processId: any, candidateId: any, data: any){
    return this.http.put(`${this.url}/api/client/clients/${clientId}/processes/${processId}/candidates/${candidateId}`,data);
  } 

  // get for selected candidate sheet
  getSelectCandidate(){
    return this.http.get(`${this.url}/api/client/selected-candidates`);
  }

  // filter for lang and prof in filter sheet
  filterSheetlangFilter(clientId: any,processId: any,lang: any,proficiencyLevels: any){
    if(lang && !proficiencyLevels){
      return this.http.get(`${this.url}/api/client/clients/${clientId}/process/${processId}/filterLangFilter?lang=${lang}`);
    }
    else if(!lang && proficiencyLevels){
      return this.http.get(`${this.url}/api/client/clients/${clientId}/process/${processId}/filterLangFilter?proficiencyLevel=${proficiencyLevels}`);
    }
    else{
      return this.http.get(`${this.url}/api/client/clients/${clientId}/process/${processId}/filterLangFilter?lang=${lang}&proficiencyLevel=${proficiencyLevels}`);
    }
  }

  // filter for lang and prof in interested candidate
  interestedlangFilter(clientId: any,processId: any,lang:any,proficiencyLevels: any){
    if(lang && !proficiencyLevels){
      return this.http.get(`${this.url}/api/client/clients/${clientId}/process/${processId}/interestedlangfilter?lang=${lang}`);
    }
    else if(!lang && proficiencyLevels){
      return this.http.get(`${this.url}/api/client/clients/${clientId}/process/${processId}/interestedlangfilter?proficiencyLevel=${proficiencyLevels}`);
    }
    else{
      return this.http.get(`${this.url}/api/client/clients/${clientId}/process/${processId}/interestedlangfilter?lang=${lang}&proficiencyLevel=${proficiencyLevels}`);
    }
  }

  // filter for lan and prof in selected sheet
  filterSelectedSheet(lang: any,proficiencyLevels: any){
    if(lang && !proficiencyLevels){
      return this.http.get(`${this.url}/api/client/selectedFilter?lang=${lang}`);
    }
    else if(!lang && proficiencyLevels){
      return this.http.get(`${this.url}/api/client/selectedFilter?proficiencyLevel=${proficiencyLevels}`);
    }
    else{
      return this.http.get(`${this.url}/api/client/selectedFilter?lang=${lang}&proficiencyLevel=${proficiencyLevels}`);
    }
  }

}
