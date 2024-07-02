import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadsService } from '../services/leads/leads.service';
import { LeadsFormComponent } from '../leads-form/leads-form.component';
// import { BlogService } from '../services/blogs/blog.service';
// import { BlogFormsComponent } from '../blog-forms/blog-forms.component';
import { LoginService } from '../services/login/login.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
 
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
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css'],
})
export class LeadsComponent implements OnInit {

  displayedColumns: string[] = [
    'SrNo',
    // 'fName',
    // 'lName',
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

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Italian', 'Spanish', 'Bahasa', 'Vietnamese','Chinese','Nepalese']; // replace with actual statuses
  proficiencyLevels = ['A1', 'A2','B1', 'B2','C1', 'C2']; // replace with actual language types
  jobStatuses = ['Working', 'Job Seeking', 'Teacher']; // replace with actual job statuses
  qualifications = ['SSC', 'HSC', 'Under Graduate', 'Post Graduate', 'PHD']; // replace with actual qualifications
  modes = ['WFH', 'WHO','Hybrid'];
  feedbacks = ['Not Intrested - CTC Not Matching', 'Not Intrested - Relocation Issue','Not Intrested - Notice Period', 'Not Intrested - Cooling Down Period','Not Intrested - Call Not Recieved', 'Not Intrested - Under Qualified"'];
  noticePeriods = ['15', '30','60', '90','90+'];
  sources = ['Linkedin', 'Naukri','Meta', 'Google','Instagram', 'Website','App','Email','Reference'];
  exps = ['0-1', '1-2','2-4', '4-8','8-12','12+'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loginService: LoginService,
    private _dialog: MatDialog,
    private leadService: LeadsService,
    private _snackBar: MatSnackBar
  ) {}

  exportExcel() {
    const formattedData = this.dataSource.data.map((lead) => {
      return {
        'Name of Candidate': lead.fName + ' ' + lead.lName,
        'Email ID': lead.email,
        'Contact Number': lead.phone,
        'Process Status': lead.status,
        'Language Type': lead.lType,
        Language: lead.language.join(', '), // Join array elements into a string
        'Proficiency Level': lead.proficiencyLevel,
        'Job Status': lead.jbStatus,
        'Educational Qualification': lead.qualification,
        Industry: lead.industry,
        Domain: lead.domain,
        Experience: lead.exp,
        Profile: lead.domain,
        'Current Location': lead.cLocation,
        'Preferred Location': lead.pLocation,
        'Current CTC': lead.currentCTC,
        'Expected CTC': lead.expectedCTC,
        'Notice Period': lead.noticePeriod,
        'WFH/WHO': lead.wfh,
        'Link to Resume': lead.resumeLink,
        'Link to LinkedIn': lead.linkedinLink,
        Feedback: lead.feedback,
        Company: lead.company,
        Remark: lead.remark,
        Organisation: lead.company,
        'Voice / non voice': lead.voiceNonVoice,
        Source: lead.source,
        'Placed by Recrutory': lead.placedBy,
      };
    });
 
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
 
    // Make header bold
    const wscols = [  
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
      { wch: 20 },
    ];
    ws['!cols'] = wscols;
 
    const wsrows = [
      { hpt: 12, hpx: 16 }, // row height
    ];
    ws['!rows'] = wsrows;
 
    // Apply bold style to the header row
    const headerCells = Object.keys(formattedData[0]);
    headerCells.forEach((key, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: key };
      ws[cellAddress].s = { font: { bold: true } };
    });
 
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
 
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(wbout, 'leads');
  }
 
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
 
  importExcel(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    const reader: FileReader = new FileReader();
 
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
 
      const data: Lead[] = XLSX.utils.sheet_to_json(ws);
      // Append imported data to existing data
      this.dataSource.data = [...this.dataSource.data, ...data];
    };
 
    reader.readAsBinaryString(target.files[0]);
  }
 
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
 
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = <any[]>XLSX.utils.sheet_to_json(ws);
      this.dataSource.data = data;
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // for creating lead
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(LeadsFormComponent, {disableClose: true});
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCuriotoryLeads();
        }
      },
    });
  }

  ngOnInit(): void {
    this.getCuriotoryLeads();
  }

  getCuriotoryLeads() {
    this.leadService.getAllLeads().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

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

  // for editing lead
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(LeadsFormComponent, {
      data,
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

  deleteEntry(id: any) {
    const confirmDelete = window.confirm(
      'Do you want to delete this entry, Please Comfirm'
    );
    if (confirmDelete) {
      this.leadService.deleteLeadById(id).subscribe({
        next: (val: any) => {
          this._snackBar.open('Data Deleted Successfully', 'Close', {
            duration: 4000,
          });
          window.location.reload();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
      this.getCuriotoryLeads();
    }
  }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';