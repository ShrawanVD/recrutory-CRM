import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CilentService } from 'src/app/services/cilent/cilent.service';
interface Person {
  clientProcessPocName: string;
  clientProcessPocDesg: string;
  clientProcessPocNumber: Number;
  clientProcessPocEmail: string;
  clientProcessPocLinkedin: string;
}
@Component({
  selector: 'app-process-poc',
  templateUrl: './process-poc.component.html',
  styleUrls: ['./process-poc.component.scss']
})
export class ProcessPocComponent {
  processId: any ;
  clientId: any;
  persons: Person[] = [];

  constructor(private clientService: CilentService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.processId = data.processId;
    this.clientId = data.clientId;
}

ngOnInit(): void {
    this.fetchPersons();
}

fetchPersons() {
    this.clientService.getProcessById(this.clientId,this.processId).subscribe({
        next: (res: any) => {
            this.persons = res.clientProcessPoc
        }
    })
}
}
