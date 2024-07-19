import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CilentService } from 'src/app/services/cilent/cilent.service';
import { FilteredSheetFormComponent } from '../../client/filtered-sheet-form/filtered-sheet-form.component';
import { LoginService } from 'src/app/services/login/login.service';
@Component({
  selector: 'app-todays-task',
  templateUrl: './todays-task.component.html',
  styleUrls: ['./todays-task.component.scss']
})
export class TodaysTaskComponent {
  processId: string | null = null;
  clientId: string | null = null;
  recruiters: any = {};
  updatedInterestedCandidate: any;
  selectedRows: string[] = [];
  openFilters: boolean = false;
  
  displayedColumns: string[] = [
    'SrNo',
    'name',
    'email',
    'phone',
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
    'assignedProcess',
    'interested',
    'action',
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
    private loginService: LoginService,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) { }
  // for creating lead
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(FilteredSheetFormComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCandidatesByRecruiterId();
        }
      },
    });
  }

  ngOnInit(): void {
    this.getCandidatesByRecruiterId();
  }

  getCandidatesByRecruiterId() {
    this.loginService.getCandidatByRecruiterId().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  // code for handling select 
  isAllSelected() {
    const numSelected = this.selectedRows.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected() {
    return this.selectedRows.length > 0 && !this.isAllSelected();
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selectedRows = [];
    } else {
      this.selectedRows = this.dataSource.data.map(row => row._id);
    }
  }

  toggleSelection(rowId: string): void {
    const index = this.selectedRows.indexOf(rowId);
    if (index === -1) {
      this.selectedRows.push(rowId);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }

  // filter for interested candidate
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValues['global'] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyDropdownFilter(value: string, column: string) {
    this.filterValues[column] = value;
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = (data: any, filter: string): boolean => {
      let searchTerms = JSON.parse(filter);
      let isMatch = true;

      if (searchTerms['global']) {
        isMatch = JSON.stringify(data).toLowerCase().includes(searchTerms['global']);
      } else {
        for (let key in searchTerms) {
          if (searchTerms[key] && (!data[key] || !data[key].toString().toLowerCase().includes(searchTerms[key].toLowerCase()))) {
            isMatch = false;
            break;
          }
        }
      }

      return isMatch;
    };
    return filterFunction;
  }

  clearFilters() {
    this.filterValues = {};
    this.dataSource.filter = "";
    this.selectedLanguage = null;
    this.selectedproficiencyLevel = null;
    this.selectedJobStatus = null;
    this.selectedQualification = null;
    this.selectedmode = null;
    this.selectedfeedback = null;
    this.selectednoticePeriod = null;
    this.selectedsource = null;
    this.selectedexp = null;
  }

  // open edit form for updating candidate information
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(FilteredSheetFormComponent, {
      data: {
        ...data,
        clientId: data.clientId,
        processId: data.clientProcessId
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCandidatesByRecruiterId();
        }
      },
    });
  }


  updateInterestedStatus(lead: any, status: any): void {
    const payload = {
      clientId: lead.clientId,
      clientProcessId: lead.clientProcessId,
      candidateId: lead._id,
      interestedStatus: status
    };
    const comfirminterested = window.confirm(`Do you want to assign this candidate as ${status} status,you cannot change it further Please Comfirm`)
    if (comfirminterested) {
      this.loginService.updateInterested(payload).subscribe({
        next: (res) => {
          this._snackBar.open(`Candidate is assigned as ${status} status Successfully`, 'Close', {
            duration: 4000,
          });
          this.getCandidatesByRecruiterId();
        },
        error: (err) => {
          if (status === 'not interested') {
            alert("Before Changing the the status to not interested. please fill the feedback and remark");
          }
          else{
            console.log(err);
          }
        }
      })

    }
  }
    // open filter div
    openFilterDiv(){
      this.openFilters = !this.openFilters;
    }
  

  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
