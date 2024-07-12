import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login/login.service';
import { LeadsService } from 'src/app/services/leads/leads.service';
import { Router } from '@angular/router';
import { CilentPocComponent } from '../../client/client-sheet/cilent-poc/cilent-poc.component';

interface Lead {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  status: string;
  lType: string;
  language: Array<string>;
  proficiencyLevel: string;
  jbStatus: string;
  qualification: string;
  industry: string;
  domain: string;
  exp: string;
  cLocation: string;
  pLocation: string;
  currentCTC: number;
  expectedCTC: number;
  noticePeriod: number;
  wfh: string;
  resumeLink: string;
  linkedinLink: string;
  feedback: string;
  remark: string;
  company: string;
  voiceNonVoice: string;
  source: string;
  placedBy: string;
}
@Component({
  selector: 'app-selected-sheet',
  templateUrl: './selected-sheet.component.html',
  styleUrls: ['./selected-sheet.component.scss']
})
export class SelectedSheetComponent {
  displayedColumns: string[] = [
    'SrNo',
    'name',
    'email',
    'phone',
    'status',
    'lType',
    'language',
    'proficiencyLevel',
    'jbStatus',
    'qualification',
    'industry',
    'domain',
    'exp',
    'cLocation',
    'pLocation',
    'currentCTC',
    'expectedCTC',
    'noticePeriod',
    'wfh',
    'resumeLink',
    'linkedinLink',
    'feedback',
    'remark',
    'company',
    'voiceNonVoice',
    'source',
    'placedBy',
    'viewDetails'
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
  proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']; // replace with actual language types
  jobStatuses = ['Working', 'Job Seeking', 'Teacher']; // replace with actual job statuses
  qualifications = ['SSC', 'HSC', 'Under Graduate', 'Post Graduate', 'PHD']; // replace with actual qualifications
  modes = ['WFH', 'WHO', 'Hybrid'];
  feedbacks = ['Not Intrested - CTC Not Matching', 'Not Intrested - Relocation Issue', 'Not Intrested - Notice Period', 'Not Intrested - Cooling Down Period', 'Not Intrested - Call Not Recieved', 'Not Intrested - Under Qualified"'];
  noticePeriods = ['15', '30', '60', '90', '90+'];
  sources = ['Linkedin', 'Naukri', 'Meta', 'Google', 'Instagram', 'Website', 'App', 'Email', 'Reference'];
  exps = ['0-1', '1-2', '2-4', '4-8', '8-12', '12+'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loginService: LoginService,
    private _dialog: MatDialog,
    private leadService: LeadsService,
    private _snackBar: MatSnackBar,
    private router :Router
  ) { }


  ngOnInit(): void {
    this.getCuriotoryLeads();
  }

  getCuriotoryLeads() {
    this.leadService.getAllLeads().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  // function for opening proccess of specific client
  openProcess(id:any){
    this.router.navigate(['dashboard/selected',id])
  }

  // view more details function
  moreDetails(clientId:any ) {
    const dialogRef = this._dialog.open(CilentPocComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCuriotoryLeads();
        }
      },
    });
  }


  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
