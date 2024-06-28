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

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css'],
})
export class LeadsComponent implements OnInit {

  displayedColumns: string[] = [
    'SrNo',
    'fName',
    'lName',
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private loginService: LoginService,
    private _dialog: MatDialog,
    private leadService: LeadsService,
    private _snackBar: MatSnackBar
  ) {}

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
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  isAdmin(): any {
    const token = this.loginService.getToken();
    if (token) {
      return true;
    }

    return false;
  }
}
1