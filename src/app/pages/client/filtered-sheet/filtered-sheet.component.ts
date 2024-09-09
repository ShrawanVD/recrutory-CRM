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
  styleUrls: ['./filtered-sheet.component.scss'],
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
  adminRole: boolean = false;

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
    'createdBy',
    'lastUpdatedBy',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;

  selectedLanguage: any = '';
  selectedProficiencyLevels: any[] = [];
  selectedJobStatus: string | null = null;
  selectedQualification: string | null = null;
  selectedmode: string | null = null;
  selectedfeedback: string | null = null;
  selectednoticePeriod: string | null = null;
  selectedsource: string | null = null;
  selectedexp: string | null = null;

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Korean' ,'Nepali','Italian', 'Spanish', 'Bahasa', 'Vietnamese', 'Mandarin', 'Nepalese', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Marathi', 'Kannada']; // replace with actual statuses
  proficiencyGroups = [
    { name: 'Basic', levels: ['A1', 'A2'] },
    { name: 'Intermediate', levels: ['B1', 'B2'] },
    { name: 'Advanced', levels: ['C1', 'C2'] },
    { name: 'HSK Levels', levels: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'] },
    { name: 'JLPT Levels', levels: ['N1', 'N2', 'N3', 'N4', 'N5'] },
    { name: 'TOPIK Levels', levels: ['TOPIK-I L1','TOPIK-I L2', 'TOPIK-II L1','TOPIK-II L2', 'TOPIK-II L3', 'TOPIK-II L4'] },
    { name: 'Other', levels: ['Native', 'Non-Native'] }
  ];
  jobStatuses = ['Working', 'Job Seeking', 'Teacher'];
  qualifications = ['SSC', 'HSC', 'Diploma', 'Advance Diploma', 'Under Graduate', 'Post Graduate', 'PHD', 'BA (Language)', 'MA (Language)'];
  modes = ['WFH', 'WFO', 'Hybrid', 'Both'];
  feedbacks = ['Interested','CTC Not Matching', 'Relocation Issue', 'Notice Period', 'Cooling Down Period', 'Call Not Recieved', 'Under Qualified', 'already associated with org', 'Currently not looking for a job', 'Rejected'];
  noticePeriods = ['Immediate', '15 Days', '1 Month', '2 Months', '3 Months','3+ Months'];
  sources = ['LinkedIn', 'Naukri', 'Meta', 'Google', 'Instagram', 'Website', 'App', 'Email', 'Reference','Other'];
  experienceRanges = ['Fresher', '0-1', '1-3', '3-6', '6-10', '10+'];

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
  ) {}
  // for creating lead
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(FilteredSheetFormComponent, {
      disableClose: true,
    });
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
    this.isTeamLead = this.loginService.isTeamLead();
    this.adminRole = this.loginService.isAdmin();
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
      },
    });
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
      this.selectedRows = this.dataSource.data.map((row) => row._id);
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
    this.applyCombinedFilters();
  }

  filterProfi(selectedProficiencyLevels: string[]) {
    this.proficiencyLevelsString = selectedProficiencyLevels.join(',');
    this.applyCombinedFilters();
  }

  applyCombinedFilters() {
    this.clientService
      .filteredSheetFilter(
        this.clientId,
        this.processId,
        this.selectedLanguage,
        this.proficiencyLevelsString,
        this.selectedexp
      )
      .subscribe({
        next: (res: any) => {
          let filteredData = res;

          // Apply existing local filters to the data received from the API
          Object.keys(this.filterValues).forEach((key) => {
            if (this.filterValues[key]) {
              filteredData = filteredData.filter(
                (item: any) =>
                  item[key] &&
                  item[key]
                    .toString()
                    .toLowerCase()
                    .includes(this.filterValues[key].toLowerCase())
              );
            }
          });

          // Update the dataSource with the filtered data
          this.dataSource.data = filteredData;

          // Reset to the first page after filtering
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  applyDropdownFilter(value: string, column: string) {
    console.log('value is: ' + value);
    if (column === 'exp') {
      this.selectedexp = value;
      this.applyCombinedFilters();
    } else {
      this.filterValues[column] = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);

      console.log('the datasource filter is: ' + this.dataSource.filter);

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    // If the input is empty, clear the filter to show all data
    if (!filterValue) {
      this.dataSource.filter = ''; // Clear the filter to show all data
    } else {
      // Create a filter object for multiple fields (name, phone, email)
      const filterObject = { nameOrNumberOrEmail: filterValue };

      // Log the filter value and object for debugging
      console.log('Applying filter:', filterValue);
      console.log('Filter object:', filterObject);

      this.dataSource.filter = JSON.stringify(filterObject);
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      if (!filter) {
        return true;
      }

      let filterValues: any;
      try {
        filterValues = JSON.parse(filter);
      } catch (error) {
        console.error('Invalid filter format:', filter);
        return false;
      }

      // Extract search term for general filtering (name, phone, email, etc.)
      const searchTerm = filterValues.nameOrNumberOrEmail || '';
      const term = searchTerm.toString().toLowerCase();

      // Check if the data matches the search term (global search across multiple fields)
      const matchesName = data.name
        ? data.name.toString().toLowerCase().includes(term)
        : false;
      const matchesPhone = data.phone
        ? data.phone.toString().toLowerCase().includes(term)
        : false;
      const matchesEmail = data.email
        ? data.email.toString().toLowerCase().includes(term)
        : false;
      const matchesCreatedBy = data.createdBy
        ? data.createdBy.toString().toLowerCase().includes(term)
        : false;
      const matchesLastUpdatedBy = data.lastUpdatedBy
        ? data.lastUpdatedBy.toString().toLowerCase().includes(term)
        : false;
      const globalMatch =
        matchesName ||
        matchesPhone ||
        matchesEmail ||
        matchesCreatedBy ||
        matchesLastUpdatedBy;

      // Column-based filtering (specific field filtering)
      let columnMatch = true;
      for (const column in filterValues) {
        if (column === 'nameOrNumberOrEmail') continue; // Skip global search term

        const filterValue = filterValues[column].toString().toLowerCase();
        const columnData = data[column]
          ? data[column].toString().toLowerCase()
          : '';

        // Apply filter for the specific column
        columnMatch = columnMatch && columnData.includes(filterValue);

        if (!columnMatch) {
          break; // No need to continue if one column filter doesn't match
        }
      }

      // Return true only if both the global search term and column-specific filters match
      return globalMatch && columnMatch;
    };
  }

  clearFilters() {
    this.filterValues = {};
    this.dataSource.filter = '';
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
        processId: this.processId,
      },
      disableClose: true,
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
      newAssignedRecruiter: this.recruiters[lead.assignedRecruiter],
    };
    if (payload.ids.length == 0) {
      alert('Please select the checkbox to assign recruiter');
      this.getCuriotoryLeads();
    } else {
      const confirmAssignRecruiter = window.confirm(
        `Do you want to assign these candidates to ${
          this.recruiters[lead.assignedRecruiter]
        }, Please Comfirm`
      );
      if (confirmAssignRecruiter) {
        this.clientService
          .updateMultipleRecruiter(this.clientId, this.processId, payload)
          .subscribe({
            next: (res: any) => {
              if (
                res.alreadyAssignedCandidates &&
                res.alreadyAssignedCandidates.length > 0
              ) {
                this._snackBar.open(
                  `Some candidates are already assign to ${
                    this.recruiters[lead.assignedRecruiter]
                  }`,
                  'Close',
                  {
                    duration: 4000,
                  }
                );
              } else {
                this._snackBar.open(
                  'Recriuter Assigned Successfully',
                  'Close',
                  {
                    duration: 4000,
                  }
                );
              }
              this.getCuriotoryLeads();
            },
            error: (err) => {
              console.log(err);
              this._snackBar.open(`some error has been occured`, 'Close', {
                duration: 4000,
              });
            },
          });
      }
    }
  }

  // open interested candidates
  openInterestedCan() {
    this.router.navigate(['interested'], { relativeTo: this.route });
  }

  deleteEntry(candidateId: any) {
    const confirmDelete = window.confirm(
      `Do you want to delete this candidates, Please Confirm`
    );

    if (confirmDelete) {
      this.clientService
        .deleteFilteredCandidate(this.clientId, this.processId, candidateId)
        .subscribe({
          next: (res) => {
            this._snackBar.open(`Candidate Deleted Successfully`, 'Close', {
              duration: 4000,
            });

            this.getCuriotoryLeads();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  // for getting srno
  getSrNo(index: number): number {
    return index + 1 + this.paginator.pageIndex * this.paginator.pageSize;
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

  isInterestAccess(): boolean {
    if (
      this.loginService.isAdmin() ||
      this.loginService.isHr() ||
      this.loginService.isTeamLead()
    )
      return true;
    else return false;
  }
}
