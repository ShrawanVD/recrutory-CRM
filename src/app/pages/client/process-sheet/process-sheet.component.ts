import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadsService } from 'src/app/services/leads/leads.service';
import { ProcessSheetFormComponent } from '../process-sheet-form/process-sheet-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessPocComponent } from './process-poc/process-poc.component';
import { CilentService } from 'src/app/services/cilent/cilent.service';

@Component({
  selector: 'app-process-sheet',
  templateUrl: './process-sheet.component.html',
  styleUrls: ['./process-sheet.component.scss']
})
export class ProcessSheetComponent implements OnInit {
  clientId: string | null = null;

  displayedColumns: string[] = [
    'SrNo',
    'clientProcessName',
    'clientProcessLanguage',
    'clientProcessCandReq',
    'clientProcessDeadline',
    'clientProcessPckg',
    'clientProcessLocation',
    'clientProcessJoining',
    'clientProcessPerks',
    'clientProcessJobDesc',
    'viewDetails',
    'action'
  ];

  dataSource!: MatTableDataSource<any>;

  filterValues: any = {};

  selectedLanguage: string | null = null;
  selectedproficiencyLevel: string | null = null;
  selectedJobStatus: string | null = null;
  selectedQualification: string | null = null;
  selectedmode: string | null = null;
  selectedfeedback: string | null = null;
  selectednoticePeriod: string | null = null;
  selectedsource: string | null = null;
  selectedexp: string | null = null;

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Italian', 'Spanish', 'Bahasa', 'Vietnamese', 'Chinese', 'Nepalese']; // replace with actual statuses
  proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  jobStatuses = ['Working', 'Job Seeking', 'Teacher'];
  qualifications = ['SSC', 'HSC', 'Under Graduate', 'Post Graduate', 'PHD'];
  modes = ['WFH', 'WHO', 'Hybrid'];
  feedbacks = ['Not Intrested - CTC Not Matching', 'Not Intrested - Relocation Issue', 'Not Intrested - Notice Period', 'Not Intrested - Cooling Down Period', 'Not Intrested - Call Not Recieved', 'Not Intrested - Under Qualified"'];
  noticePeriods = ['15', '30', '60', '90', '90+'];
  sources = ['Linkedin', 'Naukri', 'Meta', 'Google', 'Instagram', 'Website', 'App', 'Email', 'Reference'];
  exps = ['0-1', '1-2', '2-4', '4-8', '8-12', '12+'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  // for creating lead
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(ProcessSheetFormComponent, { disableClose: true,data: { clientId: this.clientId} });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllProcess();
        }
      },
    });
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.getAllProcess();
  }

  getAllProcess() {
    this.clientService.getClientById(this.clientId).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res.clientProcess);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  openInterested(processId: any) {
    if (this.clientId) {
      this.router.navigate(['process', processId], { relativeTo: this.route })
    }
  }

  moreDetails(processId: any) {
    const dialogRef = this._dialog.open(ProcessPocComponent, { disableClose: true, data: { clientId: this.clientId, processId: processId } });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllProcess();
        }
      },
    });
  }

  // update client
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(ProcessSheetFormComponent, {
      data:{
        ...data,
        clientId: this.clientId
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllProcess();
        }
      },
    });
  }

  // delete client
  deleteEntry(processId: any) {
    const confirmDelete = window.confirm(
      'Do you want to delete this process, Please Comfirm'
    );
    if (confirmDelete) {
      this.clientService.deleteProcess(this.clientId,processId).subscribe({
        next: (res) => {
          this._snackBar.open('Process Deleted Successfully', 'Close', {
            duration: 4000,
          });
          window.location.reload();
        },
        error: (err: any) => {
          console.log(err);
        },
      })
      this.getAllProcess();
    }

  }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
