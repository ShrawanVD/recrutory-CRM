import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CilentService } from 'src/app/services/cilent/cilent.service';

@Component({
  selector: 'app-process-job-desc',
  templateUrl: './process-job-desc.component.html',
  styleUrls: ['./process-job-desc.component.css']
})
export class ProcessJobDescComponent {
  processId: any;
  clientId: any;
  jobDescription: string = '';

  constructor(private clientService: CilentService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.processId = data.processId;
    this.clientId = data.clientId;
  }

  ngOnInit(): void {
    this.fetchJobDescription();
  }

  fetchJobDescription() {
    this.clientService.getProcessById(this.clientId, this.processId).subscribe({
      next: (res: any) => {
        this.jobDescription = res.clientProcessJobDesc;
      }
    });
  }
}
