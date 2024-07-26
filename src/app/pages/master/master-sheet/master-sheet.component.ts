import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadsService } from '../../../services/leads/leads.service';
import { MasterSheetFormComponent } from '../master-sheet-form/master-sheet-form.component';
import { LoginService } from '../../../services/login/login.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import * as FileSaver from 'file-saver';

interface Lead {
  _id: any,
  name: string;
  email: string;
  phone: string;
  language: Array<string>;
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
}


@Component({
  selector: 'app-master-sheet',
  templateUrl: './master-sheet.component.html',
  styleUrls: ['./master-sheet.component.css']
})
export class MasterSheetComponent implements OnInit {

  assignProcesslist: any;
  selectedRows: string[] = [];
  openFilters: boolean = false;
  proficiencyLevelsString: any;

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
    'assignProcess',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<Lead>(true, []);
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
    private loginService: LoginService,
    private _dialog: MatDialog,
    private leadService: LeadsService,
    private _snackBar: MatSnackBar
  ) { }

  exportExcel() {
    const selectedLeads = this.selection.selected.length > 0 ?
      this.selection.selected :
      this.dataSource.filteredData;

    if (selectedLeads.length === 0) {
      alert('No rows available for export');
      return;
    }

    const formattedData = selectedLeads.map((lead) => {
      return {
        'Name of Candidate': lead.name,
        'Email ID': lead.email,
        'Contact Number': lead.phone,
        Language: lead.language.join(', '), // Join array elements into a string
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
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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
    const dialogRef = this._dialog.open(MasterSheetFormComponent, { disableClose: true });
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
    this.getAllProcessList();
    this.clearFilters();
  }

  // getting the list of all process
  getAllProcessList() {
    this.leadService.getProcessList().subscribe({
      next: (res) => {
        this.assignProcesslist = res;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // updating multiple  process at a time
  updateAssignProcess(assignProcess: string): void {
    if (this.selectedRows.length === 0) {
      alert("Please select the checkbox to assign process");
      return;
    }

    const payload = {
      ids: this.selectedRows,
      newAssignProcess: assignProcess
    };

    const assignProcessAlert = window.confirm(
      `Do you want to assign these candidates to this ${assignProcess}, Please Confirm`
    );

    if (assignProcessAlert) {
      this.leadService.addProcessMultipleCandidate(payload).subscribe({
        next: (res: any) => {
          if (res.duplicateCandidates && res.duplicateCandidates.length > 0) {
            this._snackBar.open(`Some candidates are already assigned to ${assignProcess} process`, 'Close', {
              duration: 4000,
            });
          } else {
            this._snackBar.open(`Candidates are assigned to ${assignProcess} process`, 'Close', {
              duration: 4000,
            });
          }
          this.getCuriotoryLeads();
        },
        error: (err) => {
          console.log("API not working", err);
        }
      });
    }
  }

  // for selecting the multiple option  

  toggleSelection(rowId: any): void {
    this.selection.toggle(rowId);
    this.updateSelectedRows();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected() {
    return this.selectedRows.length > 0 && !this.isAllSelected();
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
    this.updateSelectedRows();
  }

  updateSelectedRows() {
    this.selectedRows = this.selection.selected.map(row => row._id);
  }

  // changeStatusToInterested() {
  //   this.selection.selected.forEach((row) => {
  //     row.status = 'Interested';
  //   });
  //   this.selection.clear();
  // }

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
    this.leadService.langFilter(this.selectedLanguage, this.proficiencyLevelsString).subscribe({
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

    this.getCuriotoryLeads();
  }

  // for editing lead
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(MasterSheetFormComponent, {
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
