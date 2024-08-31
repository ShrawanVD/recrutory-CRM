import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login/login.service';
import { LeadsService } from 'src/app/services/leads/leads.service';
import { ActivatedRoute } from '@angular/router';
import { CilentService } from 'src/app/services/cilent/cilent.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-final-selected-sheet',
  templateUrl: './final-selected-sheet.component.html',
  styleUrls: ['./final-selected-sheet.component.scss']
})
export class FinalSelectedSheetComponent {
  openFilters: boolean = false;
  filterValues: any = {};
  proficiencyLevelsString: any;

  displayedColumns: string[] = [
    'SrNo',
    'clientProcessName',
    'name',
    'email',
    'phone',
    'status',
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
  ];
 

  dataSource!: MatTableDataSource<any>;

  selectedClientName: string | null = null;
  selectedLanguage: any ="";
  selectedProficiencyLevels: any[] = [];
  selectRecruiter: string | null = null;

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Italian', 'Spanish', 'Bahasa', 'Vietnamese', 'Chinese', 'Nepalese', 'Hindi', 'Malayalam', 'Tamil', 'Telugu', 'Marathi']; // replace with actual statuses
  proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'HSK1', 'HSK2', 'HSK3','HSK4', 'HSK5', 'HSK6', 'N1', 'N2', 'N3', 'N4', 'N5', 'Native' , 'Non-Native'];
  clients: any;
  recruiters: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loginService: LoginService,
    private _dialog: MatDialog,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private leadService: LeadsService
  ) { }

  ngOnInit(): void {
    this.getCuriotoryLeads();
    this.getAllProcessList();
    this.getAllRecruiterList();
  }

  getCuriotoryLeads() {
    this.clientService.getSelectCandidate().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  getAllProcessList(){
    this.leadService.getProcessList().subscribe({
      next:(res) =>{
        this.clients = res;
      },
      error:(err)  =>{
        console.log(err);
      }
    })
  }

  getAllRecruiterList(){
    this.clientService.getRecruiter('Recruiter').subscribe({
      next:(res) =>{
        this.recruiters = res;
        console.log(this.recruiters.value);
      },
      error:(err) =>{
        console.log(err);
      }
    })
  }
  getRecruiterIds(): string[] {
    return Object.keys(this.recruiters);
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
    this.clientService.filterSelectedSheet(this.selectedLanguage, this.proficiencyLevelsString).subscribe({
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
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
        // If the filter string is empty, return true to show all items
        return true;
      }
  
      let searchTerms: any;
      try {
        // Parse filter string, which should be in JSON format
        searchTerms = JSON.parse(filter);
      } catch (error) {
        // If parsing fails, log the error and return false to exclude the item
        console.error("Invalid filter format:", filter);
        return false;
      }
  
      // Log parsed search terms for debugging
  
      const searchTerm = searchTerms.nameOrNumberOrEmail;
  
      // Convert the search term to lowercase for case-insensitive comparison
      const term = searchTerm.toString().toLowerCase();
  
      // Check if the data matches the 'process name' field
      const matchesProcessName = data.clientProcessName ? data.clientProcessName.toString().toLowerCase().includes(term) : false;
  
      // Check if the data matches the 'name' field
      const matchesName = data.name ? data.name.toString().toLowerCase().includes(term) : false;
  
      // Check if the data matches the 'phone' field
      const matchesPhone = data.phone ? data.phone.toString().toLowerCase().includes(term) : false;
  
      // Check if the data matches the 'email' field
      const matchesEmail = data.email ? data.email.toString().toLowerCase().includes(term) : false;

      // Check if the data matches the 'created by' field
      const matchesCreatedBy = data.createdBy ? data.createdBy.toString().toLowerCase().includes(term) : false;

      // Check if the data matches the 'last updated by' field
      const matchesLastUpdatedBy = data.lastUpdatedBy ? data.lastUpdatedBy.toString().toLowerCase().includes(term) : false;
  
      // Match if the search term is found in 'name', 'phone', or 'email'
      return matchesProcessName || matchesName || matchesPhone || matchesEmail || matchesCreatedBy || matchesLastUpdatedBy ;
    };
  }

  clearFilters() {
    this.filterValues = {};
    this.dataSource.filter = "";
    this.selectedLanguage = null;
    this.selectedProficiencyLevels = [];
    this.selectRecruiter = null;
    this.getCuriotoryLeads();
  }

   // open filter div
   openFilterDiv(){
    this.openFilters = !this.openFilters;
  }
  
    // for getting srno 
    getSrNo(index: number): number {
      return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
    }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
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
        'Client Name': lead.clientInfo,
        'Name': lead.candidate.name,
        'Email': lead.candidate.email,
        'Phone': lead.candidate.phone,
        'Lead Status': lead.candidate.status,
        'Language Type': lTypes,
        'Language': langs,
        'Proficiency Level': proficiencyLevels,
        'Job Status': lead.candidate.jbStatus,
        'Qualification': lead.candidate.qualification,
        'Industry': lead.candidate.industry,
        'Profile': lead.candidate.domain,
        'Experience': lead.candidate.exp,
        'Current Location': lead.candidate.cLocation,
        'Preferred Location': lead.candidate.pLocation,
        'Current CTC (in Lakhs)': lead.candidate.currentCTC,
        'Expected CTC (in Lakhs)': lead.candidate.expectedCTC,
        'Notice Period (in days)': lead.candidate.noticePeriod,
        'Mode': lead.candidate.wfh,
        'Resume': lead.candidate.resumeLink,
        'LinkedIn Profile': lead.candidate.linkedinLink,
        'Feedback': lead.candidate.feedback,
        'Remark': lead.candidate.remark,
        'Organisation': lead.candidate.company,
        'Voice/Non-voice': lead.candidate.voiceNonVoice,
        'Source': lead.candidate.source,
        'Recruiter': lead.candidate.assignedRecruiter
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
    this.saveAsExcelFile(excelBuffer, 'SelectedCandidates');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
