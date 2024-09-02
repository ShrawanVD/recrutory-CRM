import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/login/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { ProcessSheetFormComponent } from '../process-sheet-form/process-sheet-form.component';
import { ProcessPocComponent } from './process-poc/process-poc.component';
import { CilentService } from 'src/app/services/cilent/cilent.service';
import { ProcessJobDescComponent } from './process-job-desc/process-job-desc.component';

@Component({
  selector: 'app-process-sheet',
  templateUrl: './process-sheet.component.html',
  styleUrls: ['./process-sheet.component.scss']
})
export class ProcessSheetComponent implements OnInit {
  clientId: string | null = null;
  openFilters: boolean = false;
  displayedColumns: string[] = [
    'SrNo',
    'clientProcessName',
    'clientProcessLanguage',
    'clientProcessCandReq',
    'clientProcessDeadline',
    'clientProcessPckg',
    'clientProcessLocation',
    'clientProcessJoining',
    'clientProcessPerks',
    'clientProcessJobDesc',
    'viewDetails',
    'action'
  ];

  dataSource!: MatTableDataSource<any>;

  filterValues: any = {};

  selectedLanguage: string | null = null;
  selectedlocation: string | null = null;
  selectedPackage: string | null = null;
  selectedJd: string | null = null;

  selectedDeadline: Date | null = null;
  selectedJoiningDate: Date | null = null;

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Italian', 'Spanish', 'Bahasa', 'Vietnamese', 'Chinese', 'Nepalese'];
  locations: any;
  packages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  jobDescs: any;

  processes: any[] = [];  // Store all processes
  filteredProcesses: any[] = [];  // Store filtered processes

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.getAllProcess();
  }

    // for getting srno 
    getSrNo(index: number): number {
      return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
    }

  getAllProcess() {
    this.clientService.getClientById(this.clientId).subscribe({
      next: (res: any) => {
        this.processes = res.clientProcess;
        this.filteredProcesses = this.processes;
        this.dataSource = new MatTableDataSource(this.filteredProcesses);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.locations = this.getUniqueLocations(res.clientProcess);
        this.jobDescs = this.getUniqueJobdescr(res.clientProcess);
      },
      error: console.log,
    });
  }

  getUniqueLocations(clientProcesses: any[]): string[] {
    const allLocations = clientProcesses.map(process => process.clientProcessLocation);
    return Array.from(new Set(allLocations));
  }

  getUniqueJobdescr(clientProcesses: any[]): string[] {
    const alljd = clientProcesses.map(process => process.clientProcessJobDesc);
    return Array.from(new Set(alljd));
  }

  openInterested(processId: any) {
    if (this.clientId) {
      this.router.navigate(['process', processId], { relativeTo: this.route });
    }
  }

  viewJobDesc(processId: any) {
    const dialogRef = this._dialog.open(ProcessJobDescComponent, {
      disableClose: true,
      data: { clientId: this.clientId, processId: processId }
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllProcess();
        }
      },
    });
  }

  moreDetails(processId: any) {
    const dialogRef = this._dialog.open(ProcessPocComponent, { disableClose: true, data: { clientId: this.clientId, processId: processId } });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllProcess();
        }
      },
    });
  }

  openFilterDiv() {
    this.openFilters = !this.openFilters;
  }


  applyDropdownFilter(value: string, column: string) {
    this.filterValues[column] = value;
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyDateFilter(value: Date, field: string) {
    if (field === 'clientProcessDeadline') {
      this.selectedDeadline = value;
    } else if (field === 'clientProcessJoining') {
      this.selectedJoiningDate = value;
    }

    this.filterProcesses();
  }

  filterProcesses() {
    this.filteredProcesses = this.processes.filter(process => {
      let isMatch = true;

      if (this.selectedDeadline) {
        const selectedDate = moment(this.selectedDeadline);
        const startDate = selectedDate.clone().subtract(5, 'months');
        const processDate = moment(process.clientProcessDeadline);
        if (!processDate.isBetween(startDate, selectedDate, undefined, '[]')) {
          isMatch = false;
        }
      }

      if (this.selectedJoiningDate) {
        const selectedDate = moment(this.selectedJoiningDate);
        const startDate = selectedDate.clone().subtract(5, 'months');
        const processDate = moment(process.clientProcessJoining);
        if (!processDate.isBetween(startDate, selectedDate, undefined, '[]')) {
          isMatch = false;
        }
      }

      return isMatch;
    });

    this.dataSource.data = this.filteredProcesses;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
  
  
      // Match if the search term is found in 'name', 'phone', or 'email'
      return matchesProcessName;
    };
  }

  clearFilters() {
    this.filterValues = {};
    this.dataSource.filter = "";
    this.selectedLanguage = null;
    this.selectedlocation = null;
    this.selectedPackage = null;
    this.selectedJd = null;

    this.selectedDeadline = null;
    this.selectedJoiningDate = null;

    this.filterProcesses();

     // Reset the form fields
     const filterInputs = document.querySelectorAll('input, select');
     filterInputs.forEach(input => (input as HTMLInputElement).value = '');
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(ProcessSheetFormComponent, { disableClose: true, data: { clientId: this.clientId } });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllProcess();
        }
      },
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(ProcessSheetFormComponent, {
      data: {
        ...data,
        clientId: this.clientId
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllProcess();
        }
      },
    });
  }

  deleteEntry(processId: any) {
    const confirmDelete = window.confirm('Do you want to delete this process, Please Confirm');
    if (confirmDelete) {
      this.clientService.deleteProcess(this.clientId, processId).subscribe({
        next: (res) => {
          this._snackBar.open('Process Deleted Successfully', 'Close', {
            duration: 4000,
          });
          window.location.reload();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
      this.getAllProcess();
    }
  }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isLead(){
    return this.loginService.isTeamLead();
  }

  isRecruiter(){
    return this.loginService.isRecruiter();
  }
}
