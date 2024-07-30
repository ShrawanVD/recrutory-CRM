import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login/login.service';
import { ClientSheetFormComponent } from '../client-sheet-form/client-sheet-form.component';
import { Router } from '@angular/router';
import { CilentPocComponent } from './cilent-poc/cilent-poc.component';
import { CilentService } from 'src/app/services/cilent/cilent.service';

interface Lead {
  clientName: string;
  clientVertical: string;
}
@Component({
  selector: 'app-client-sheet',
  templateUrl: './client-sheet.component.html',
  styleUrls: ['./client-sheet.component.scss']
})
export class ClientSheetComponent implements OnInit {
  filterValues: any = {};

  displayedColumns: string[] = [
    'SrNo',
    'clientName',
    'clientVertical',
    'viewDetails',
    'action'
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService
  ) { }

  // for creating lead
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(ClientSheetFormComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCilents();
        }
      },
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

  ngOnInit(): void {
    this.getCilents();
  }

  // for getting srno 
  getSrNo(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  getCilents() {
    this.clientService.getAllClient().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  // function for opening proccess of specific client
  openProcess(id: any) {
    this.router.navigate(['dashboard/client', id])
  }

  // view more details function
  moreDetails(clientId: any) {
    const dialogRef = this._dialog.open(CilentPocComponent, { disableClose: true, data: { clientId: clientId } });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCilents();
        }
      },
    });
  }
  // update client
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(ClientSheetFormComponent, {
      data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCilents();
        }
      },
    });
  }

  // delete client
  deleteEntry(clientId: any) {
    const confirmDelete = window.confirm(
      'Do you want to delete this client, Please Comfirm'
    );
    if (confirmDelete) {
      this.clientService.deleteClient(clientId).subscribe({
        next: (res) => {
          this._snackBar.open('Client Deleted Successfully', 'Close', {
            duration: 4000,
          });
          window.location.reload();
        },
        error: (err: any) => {
          console.log(err);
        },
      })
      this.getCilents();
    }

  }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isHr(){
    return this.loginService.isHr();
  }

  isRecruiter(){
    return this.loginService.isRecruiter();
  }
}
