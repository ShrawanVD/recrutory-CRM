import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { AddMemberFormComponent } from '../add-member-form/add-member-form.component';

@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss']
})
export class AddMembersComponent implements OnInit {
  openFilters: boolean = false;
  displayedColumns: string[] = ['SrNo', 'userName', 'userRole', 'action'];
  dataSource!: MatTableDataSource<any>;
  filterValues: any = {};
  selectedRole: string | null = null;
  roles: string[] = ['Admin', 'Team Lead', 'HR', 'Recruiter'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.loginService.getAllUsers().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  openFilterDiv() {
    this.openFilters = !this.openFilters;
  }

  // Creating user
  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(AddMemberFormComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllUsers();
        }
      },
    });
  }

  // Delete
  deleteEntry(id: any) {
    const confirmDelete = window.confirm('Do you want to delete this user, Please Confirm');
    if (confirmDelete) {
      this.loginService.deleteUser(id).subscribe({
        next: (res) => {
          this._snackBar.open('User Deleted Successfully', 'Close', { duration: 4000 });
          this.getAllUsers();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  // Update
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddMemberFormComponent, {
      data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllUsers();
        }
      },
    });
  }

  getRole(): any {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValues['global'] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyDropdownFilter(filterValue: string | null, filterKey: string) {
    this.filterValues[filterKey] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters() {
    this.filterValues = {};
    this.selectedRole = null;
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data, filter): boolean => {
      const filterValues = JSON.parse(filter);
      const matchFilter: boolean[] = [];

      // Global search filter
      if (filterValues.global) {
        matchFilter.push(
          data.username.toLowerCase().includes(filterValues.global) ||
          data.role.toLowerCase().includes(filterValues.global)
        );
      }

      // Role filter
      if (filterValues.role) {
        matchFilter.push(data.role === filterValues.role);
      }

      return matchFilter.every(Boolean);
    };
  }
}
