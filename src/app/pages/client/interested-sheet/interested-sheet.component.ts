import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FilteredSheetFormComponent } from '../filtered-sheet-form/filtered-sheet-form.component';
import { CilentService } from 'src/app/services/cilent/cilent.service';
import { Location } from '@angular/common';
import { LeadsService } from 'src/app/services/leads/leads.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-interested-sheet',
  templateUrl: './interested-sheet.component.html',
  styleUrls: ['./interested-sheet.component.scss']
})
export class InterestedSheetComponent {
  processId: string | null = null;
  clientId: string | null = null;
  recruiters: any = {};
  updatedInterestedCandidate: any;
  selectedRows: string[] = [];
  openFilters: boolean = false;
  proficiencyLevelsString: any;
  
  displayedColumns1: string[] = [
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
    'status',
    // 'action'
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
  selectedRound: string | null = null;

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Korean' ,'Nepali','Italian', 'Spanish', 'Bahasa', 'Vietnamese', 'Mandarin', 'Nepalese', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Marathi', 'Kannada']; // replace with actual statuses
  proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'N1', 'N2', 'N3', 'N4', 'N5', 'TOPIK-I L1','TOPIK-I L2', 'TOPIK-II L1','TOPIK-II L2', 'TOPIK-II L3', 'TOPIK-II L4', 'Native', 'Non-Native'];
  jobStatuses = ['Working', 'Job Seeking', 'Teacher'];
  qualifications = ['SSC', 'HSC', 'Diploma', 'Advance Diploma', 'Under Graduate', 'Post Graduate', 'PHD', 'BA (Language)', 'MA (Language)'];
  modes = ['WFH', 'WFO', 'Hybrid', 'Both'];
  feedbacks = ['Interested','CTC Not Matching', 'Relocation Issue', 'Notice Period', 'Cooling Down Period', 'Call Not Recieved', 'Under Qualified', 'already associated with org', 'Currently not looking for a job', 'Rejected'];
  noticePeriods = ['Immediate', '15 Days', '1 Month', '2 Months', '3 Months','3+ Months'];
  sources = ['LinkedIn', 'Naukri', 'Meta', 'Google', 'Instagram', 'Website', 'App', 'Email', 'Reference','Other'];
  experienceRanges = ['Fresher', '0-1', '1-3', '3-6', '6-10', '10+'];
  round = ['HR', 'OPS', 'Client', 'Selected', 'Rejected'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private clientService: CilentService,
    private leadService: LeadsService,
    private _snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
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
    this.getCuriotoryLeads();
    this.clearFilters();
  }

  getCuriotoryLeads() {
    this.clientService.getProcessById(this.clientId, this.processId).subscribe({
      next: (res: any) => {
        const filteredCandidates = res.interestedCandidates.filter((candidate: any) => candidate.interested === "interested");
        this.dataSource = new MatTableDataSource(filteredCandidates);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  // open filter div
  openFilterDiv() {
    this.openFilters = !this.openFilters;
  }

  filterLang(value: any) {
    this.selectedLanguage = value;
    this.applyCombinedFilters();
  }

  filterProfi(selectedProficiencyLevels: string[]) {
    this.proficiencyLevelsString = selectedProficiencyLevels.join(',');
    this.applyCombinedFilters()
  }

  applyDropdownFilter(value: string, column: string) {
    console.log("value is: " + value);
    if (column === 'exp') {
      this.selectedexp = value;
      this.applyCombinedFilters();
    } else {
      this.filterValues[column] = value;
      this.dataSource.filter = JSON.stringify(this.filterValues);

      console.log("the datasource filter is: " + this.dataSource.filter);
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }



// combined filters for language and exp columns (backend api calls)
  applyCombinedFilters() {
    // Call the service to apply the combined filters (language, proficiency levels, and experience)
    this.leadService.filterCandidates(this.selectedLanguage, this.proficiencyLevelsString, this.selectedexp).subscribe({
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
  
        // Update the dataSource with the filtered data
        this.dataSource.data = filteredData;
  
        // Reset to the first page after filtering
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    console.log("apply filter: filtervalue is: " + filterValue);
  
    // If the input is empty, clear the filter to show all data
    if (!filterValue) {
      this.dataSource.filter = ''; // Clear the filter to show all data
    } else {
      // Create a filter object for multiple fields (name, phone, email)
      const filterObject = { nameOrNumberOrEmail: filterValue };
  
      // Log the filter value and object for debugging
      console.log("Applying filter:", filterValue);
      console.log("Filter object:", filterObject);
  
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
        console.error("Invalid filter format:", filter);
        return false;
      }
  
      // Extract search term for general filtering (name, phone, email, etc.)
      const searchTerm = filterValues.nameOrNumberOrEmail || '';
      const term = searchTerm.toString().toLowerCase();
  
      // Check if the data matches the search term (global search across multiple fields)
      const matchesName = data.name ? data.name.toString().toLowerCase().includes(term) : false;
      const matchesPhone = data.phone ? data.phone.toString().toLowerCase().includes(term) : false;
      const matchesEmail = data.email ? data.email.toString().toLowerCase().includes(term) : false;
      const matchesCreatedBy = data.createdBy ? data.createdBy.toString().toLowerCase().includes(term) : false;
      const matchesLastUpdatedBy = data.lastUpdatedBy ? data.lastUpdatedBy.toString().toLowerCase().includes(term) : false;
      const globalMatch = matchesName || matchesPhone || matchesEmail || matchesCreatedBy || matchesLastUpdatedBy;
  
      // Column-based filtering (specific field filtering)
      let columnMatch = true;
      for (const column in filterValues) {
        if (column === 'nameOrNumberOrEmail') continue; // Skip global search term
  
        const filterValue = filterValues[column].toString().toLowerCase();
        const columnData = data[column] ? data[column].toString().toLowerCase() : '';
  
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

  updateInterested(lead: any, status: boolean): void {
    lead.interested = status;
    // this.clientService.updateLead(lead).subscribe();
  }

  updateRound(lead: any): void {
    const confirmSelectRound =  window.confirm(
      `Do you want to change the status of the candidate to ${lead.status}, Please Confirm`
    );

    if(lead.status === 'Rejected'){
      // const confirmRemark = window.confirm(
      //   `Please fill the remark before changing candidate status to ${lead.status}`
      // );

      if(confirmSelectRound){
        this.clientService.updateFilteredCandidate(this.clientId,this.processId,lead._id,lead).subscribe({
          next: (val) => {
            this._snackBar.open('Candidate status updated successfully', 'Close', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error(err);
            this._snackBar.open('Failed to update status candidate data', 'Close', {
              duration: 3000,
            });
          },
        });
      }

    }
    else{
      if(confirmSelectRound){
        this.clientService.updateFilteredCandidate(this.clientId,this.processId,lead._id,lead).subscribe({
          next: (val) => {
            this._snackBar.open('Candidate status updated successfully', 'Close', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error(err);
            this._snackBar.open('Failed to update status candidate data', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    }

  }

  // open filter component
  openFilter(){
    this.location.back();
  }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
    // for getting srno 
    getSrNo(index: number): number {
      return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
    }

  exportExcel() {
    const leadsToExport = this.dataSource.filteredData;

    if (leadsToExport.length === 0) {
      alert('No rows available for export');
      return;
    }

    const formattedData = leadsToExport.map((lead: any, index: number) => {

      const lTypes = lead.language.map((langObj: { lType: string; }) => langObj.lType).join(', ');
      const langs = lead.language.map((langObj: { lang: string; }) => langObj.lang).join(', ');
      const proficiencyLevels = lead.language.map((langObj: { proficiencyLevel: string; }) => langObj.proficiencyLevel).join(', ');

      return {
        'SrNo': index + 1,
        // 'Client Name': lead.clientInfo,
        'Name': lead.name,
        'Email': lead.email,
        'Phone': lead.phone,
        'Lead Status': lead.status,
        'Language Type': lTypes,
        'Language': langs,
        'Proficiency Level': proficiencyLevels,
        'Job Status': lead.jbStatus,
        'Qualification': lead.qualification,
        'Industry': lead.industry,
        'Profile': lead.domain,
        'Experience': lead.exp,
        'Current Location': lead.cLocation,
        'Preferred Location': lead.pLocation,
        'Current CTC (in Lakhs)': lead.currentCTC,
        'Expected CTC (in Lakhs)': lead.expectedCTC,
        'Notice Period (in days)': lead.noticePeriod,
        'Mode': lead.wfh,
        'Resume': lead.resumeLink,
        'LinkedIn Profile': lead.linkedinLink,
        'Feedback': lead.feedback,
        'Remark': lead.remark,
        'Organisation': lead.company,
        'Voice/Non-voice': lead.voiceNonVoice,
        'Source': lead.source,
        'Recruiter': lead.assignedRecruiter,
        // 'Status': lead.candidate.status
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

    const wscols = [
      { wch: 5 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 50 },
      { wch: 50 },
      { wch: 50 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];

    ws['!cols'] = wscols;

    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'InterestedCandidates');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
