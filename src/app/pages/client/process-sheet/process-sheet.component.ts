import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadsService } from 'src/app/services/leads/leads.service';
import { ProcessSheetFormComponent } from '../process-sheet-form/process-sheet-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessPocComponent } from './process-poc/process-poc.component';
import { CilentService } from 'src/app/services/cilent/cilent.service';

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

  languages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japenese', 'Italian', 'Spanish', 'Bahasa', 'Vietnamese', 'Chinese', 'Nepalese']; // replace with actual statuses
  locations: any;
  // 'Pune', 'New York', 'Mumbai'
  packages = ['1', '2', '3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];
  jobDescs: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  // for creating lead
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(ProcessSheetFormComponent, { disableClose: true,data: { clientId: this.clientId} });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllProcess();
        }
      },
    });
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.getAllProcess();
  }

  getAllProcess() {
    this.clientService.getClientById(this.clientId).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res.clientProcess);
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
      this.router.navigate(['process', processId], { relativeTo: this.route })
    }
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

    // open filter div
    openFilterDiv() {
      this.openFilters = !this.openFilters;
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
    this.selectedlocation = null;
    this.selectedPackage = null;
    this.selectedJd = null;
  }

  // update client
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(ProcessSheetFormComponent, {
      data:{
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

  // delete client
  deleteEntry(processId: any) {
    const confirmDelete = window.confirm(
      'Do you want to delete this process, Please Comfirm'
    );
    if (confirmDelete) {
      this.clientService.deleteProcess(this.clientId,processId).subscribe({
        next: (res) => {
          this._snackBar.open('Process Deleted Successfully', 'Close', {
            duration: 4000,
          });
          window.location.reload();
        },
        error: (err: any) => {
          console.log(err);
        },
      })
      this.getAllProcess();
    }

  }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
