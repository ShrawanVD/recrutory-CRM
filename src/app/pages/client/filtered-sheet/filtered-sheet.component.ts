import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FilteredSheetFormComponent } from '../filtered-sheet-form/filtered-sheet-form.component';
import { CilentService } from 'src/app/services/cilent/cilent.service';
import { LeadsService } from 'src/app/services/leads/leads.service';
import { LoginService } from 'src/app/services/login/login.service';
@Component({
  selector: 'app-filtered-sheet',
  templateUrl: './filtered-sheet.component.html',
  styleUrls: ['./filtered-sheet.component.scss']
})
export class FilteredSheetComponent {
  processId: string | null = null;
  clientId: string | null = null;
  recruiters: any = {};
  updatedInterestedCandidate: any;
  selectedRows: string[] = [];
  openFilters: boolean = false;
  filterValues: any = {};
  proficiencyLevelsString: any;
  isTeamLead: boolean = false;

  displayedColumns: string[] = [
    'select',
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
    'assignedRecruiter',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;

  selectedLanguage: any = "";
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
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private leadService: LeadsService,
    private loginService: LoginService
  ) { }
  // for creating lead
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(FilteredSheetFormComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCuriotoryLeads();
        }
      },
    });
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.isTeamLead = this.loginService.isTeamLead()
    console.log(this.isTeamLead);
    this.getCuriotoryLeads();
    this.getRecruitersList();
  }

  getCuriotoryLeads() {
    this.clientService.getProcessById(this.clientId, this.processId).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res.interestedCandidates);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  getRecruitersList(): void {
    this.clientService.getRecruiter('Recruiter').subscribe({
      next: (res) => {
        this.recruiters = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  getRecruiterIds(): string[] {
    return Object.keys(this.recruiters);
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
  filterLang(value: any) {
    this.selectedLanguage = value;
    this.filterLangProf();
  }

  filterProfi(selectedProficiencyLevels: string[]) {
    this.proficiencyLevelsString = selectedProficiencyLevels.join(',');
    this.filterLangProf()
  }

  // apply filter for lang and proficiency
  filterLangProf() {
    this.clientService.filterSheetlangFilter(this.clientId,this.processId,this.selectedLanguage, this.proficiencyLevelsString).subscribe({
      next: (res: any) => {
        let filteredData = res;

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

    this.getCuriotoryLeads();
  }

  // open edit form for updating candidate information
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(FilteredSheetFormComponent, {
      data: {
        ...data,
        clientId: this.clientId,
        processId: this.processId
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCuriotoryLeads();
        }
      },
    });
  }


  updateInterested(lead: any, status: boolean): void {
    lead.interested = status;
    // this.clientService.updateLead(lead).subscribe();
  }

  updateRound(lead: any): void {
    // this.clientService.updateLead(lead).subscribe();
  }

  // remaining: to update the recruiter for one and for all
  updateRecruiter(leadId: string, lead: any): void {
    const payload = {
      ids: this.selectedRows,
      recruiterId: lead.assignedRecruiter,
      newAssignedRecruiter: this.recruiters[lead.assignedRecruiter]
    };
    if (payload.ids.length == 0) {
      alert("Please select the checkbox to assign recruiter");
      this.getCuriotoryLeads();
    } else {
      const confirmAssignRecruiter = window.confirm(`Do you want to assign these candidates to ${this.recruiters[lead.assignedRecruiter]}, Please Comfirm`)
      if (confirmAssignRecruiter) {
        this.clientService.updateMultipleRecruiter(this.clientId, this.processId, payload).subscribe({
          next: (res: any) => {
            if (res.alreadyAssignedCandidates && res.alreadyAssignedCandidates.length > 0) {
              this._snackBar.open(`Some candidates are already assign to ${this.recruiters[lead.assignedRecruiter]}`, 'Close', {
                duration: 4000,
              });
            }
            else {
              this._snackBar.open('Recriuter Assigned Successfully', 'Close', {
                duration: 4000,
              });
            }
            this.getCuriotoryLeads();
          },
          error: (err) => {
            console.log(err);
            this._snackBar.open(`some error has been occured`, 'Close', {
              duration: 4000,
            });
          }
        })
      }
    }

  }

  // open interested candidates
  openInterestedCan() {
    this.router.navigate(['interested'], { relativeTo: this.route });
  }

  deleteEntry(candidateId: any){
    const confirmDelete = window.confirm(
      `Do you want to delete this candidates, Please Confirm`
    );

    if(confirmDelete){
      this.clientService.deleteFilteredCandidate(this.clientId,this.processId,candidateId).subscribe({
        next:(res) =>{
          this._snackBar.open(`Candidate Deleted Successfully`, 'Close', {
            duration: 4000,
          });

          this.getCuriotoryLeads();
        },
        error:(err) =>{
          console.log(err);
        }
      })
    }
    
  }
    // for getting srno 
    getSrNo(index: number): number {
      return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
    }


  // open filter div
  openFilterDiv() {
    this.openFilters = !this.openFilters;
  }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isInterestAccess(): boolean{
    if(this.loginService.isAdmin() || this.loginService.isHr() || this.loginService.isTeamLead())
      return true;
    else
      return false;
  }


}
