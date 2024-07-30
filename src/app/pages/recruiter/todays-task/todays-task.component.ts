import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
// import {provideNativeDateAdapter} from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CilentService } from 'src/app/services/cilent/cilent.service';
import { FilteredSheetFormComponent } from '../../client/filtered-sheet-form/filtered-sheet-form.component';
import { LoginService } from 'src/app/services/login/login.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-todays-task',
  templateUrl: './todays-task.component.html',
  styleUrls: ['./todays-task.component.scss']
})

export class TodaysTaskComponent {


// FormControl for the date picker
dateControl = new FormControl();


  processId: string | null = null;
  clientId: string | null = null;
  recruiters: any = {};
  updatedInterestedCandidate: any;
  selectedRows: string[] = [];
  openFilters: boolean = false;
  proficiencyLevelsString: any;
  recruiterId: any;

  displayedColumns: string[] = [
    'SrNo',
    'name',
    'email',
    'phone',
    'language',
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

  selectedLanguage: any ="";
  selectedProficiencyLevels: any[] = [];
  selectedJobStatus: string | null = null;
  selectedQualification: string | null = null;
  selectedmode: string | null = null;
  selectedfeedback: string | null = null;
  selectednoticePeriod: string | null = null;
  selectedsource: string | null = null;
  selectedexp: string | null = null;

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Italian', 'Spanish', 'Bahasa', 'Vietnamese', 'Chinese', 'Nepalese', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Marathi']; // replace with actual statuses
  proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'HSK1', 'HSK2', 'HSK3','HSK4', 'HSK5', 'HSK6', 'N1', 'N2', 'N3', 'N4', 'N5', 'Native' , 'Non-Native'];
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
    this.recruiterId = this.loginService.getRecruiterId();
  }

  getCandidatesByRecruiterId() {
    this.loginService.getCandidateByRecruiterId().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyDateFilter(event: any) {
    const selectedDate = event.value;
    if (selectedDate) {
      const formattedDate = this.formatDate(selectedDate);
      this.filterValues['assignedRecruiterDate'] = formattedDate;
      this.dataSource.filter = JSON.stringify(this.filterValues);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
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
  filterLang(value: any){
    this.selectedLanguage = value;
    this.filterLangProf();
  }

  filterProfi(selectedProficiencyLevels: string[]) {
    this.proficiencyLevelsString = selectedProficiencyLevels.join(',');
    this.filterLangProf()
  }

  // apply filter for lang and proficiency
  filterLangProf() {
    this.loginService.getFilteredCanByRecruiterId(this.selectedLanguage, this.proficiencyLevelsString).subscribe({
      next: (res: any) => {
        let filteredData = res;
        console.log("this is filteradata",filteredData)
        // Apply existing local filters to the data received from the API
        Object.keys(this.filterValues).forEach(key => {
          if (this.filterValues[key]) {
            filteredData = filteredData.filter((item: any) => 
              item[key] && item[key].toString().toLowerCase().includes(this.filterValues[key].toLowerCase())
            );
          }
        });
  
        this.dataSource = new MatTableDataSource(filteredData);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyDropdownFilter(value: string, column: string) {
    this.filterValues[column] = value;
  
    // Check if language or proficiency filter is applied
    if (column === 'language' || column === 'proficiencyLevel') {
      this.filterLangProf();
    } else {
      this.dataSource.filter = JSON.stringify(this.filterValues);
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
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
    this.selectedProficiencyLevels = [];
    this.selectedJobStatus = null;
    this.selectedQualification = null;
    this.selectedmode = null;
    this.selectedfeedback = null;
    this.selectednoticePeriod = null;
    this.selectedsource = null;
    this.selectedexp = null;

    // Clear the date filter
    this.dateControl.reset();
    this.getCandidatesByRecruiterId();
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

    // for getting srno 
    getSrNo(index: number): number {
      return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
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


