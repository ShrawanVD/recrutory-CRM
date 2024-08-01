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

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Italian', 'Spanish', 'Bahasa', 'Vietnamese', 'Chinese', 'Nepalese', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Marathi']; // replace with actual statuses
  proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'HSK1', 'HSK2', 'HSK3','HSK4', 'HSK5', 'HSK6', 'N1', 'N2', 'N3', 'N4', 'N5', 'Native' , 'Non-Native'];
  jobStatuses = ['Working', 'Job Seeking', 'Teacher'];
  qualifications = ['SSC', 'HSC', 'Under Graduate', 'Post Graduate', 'PHD'];
  modes = ['WFH', 'WHO', 'Hybrid'];
  feedbacks = ['Not Intrested - CTC Not Matching', 'Not Intrested - Relocation Issue', 'Not Intrested - Notice Period', 'Not Intrested - Cooling Down Period', 'Not Intrested - Call Not Recieved', 'Not Intrested - Under Qualified"'];
  noticePeriods = ['15', '30', '60', '90', '90+'];
  sources = ['Linkedin', 'Naukri', 'Meta', 'Google', 'Instagram', 'Website', 'App', 'Email', 'Reference'];
  exps = ['0-1', '1-2', '2-4', '4-8', '8-12', '12+'];
  round = ['Round 1','Round 2','Round 3','Round 4','Selected'];

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
    this.clientService.interestedlangFilter(this.clientId,this.processId,this.selectedLanguage, this.proficiencyLevelsString).subscribe({
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

  // filter for interested candidate
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

  updateInterested(lead: any, status: boolean): void {
    lead.interested = status;
    // this.clientService.updateLead(lead).subscribe();
  }

  updateRound(lead: any): void {
    const confirmSelectRound =  window.confirm(
      `Do you want to change the status of the candidate to ${lead.status}, Please Confirm`
    );

    if(lead.status === 'Rejected'){
      const confirmRemark = window.confirm(
        `Please fill the remark before changing candidate status to ${lead.status}`
      );

      if(confirmRemark){
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
