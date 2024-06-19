import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BlogService } from '../services/blogs/blog.service';
import { BlogFormsComponent } from '../blog-forms/blog-forms.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
 
  displayedColumns: string[] = [
    'srno',
    'views',
    'date',
    'title',
    'content',
    'imageUrl',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private blog: BlogService,private _snackBar: MatSnackBar,private loginService:LoginService) { }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(BlogFormsComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCuriotoryBlog();
        }
      },
    });
  }

  ngOnInit(): void {
    this.getCuriotoryBlog();
  }

  getCuriotoryBlog() {
    this.blog.getAllCuriotroyBlogs().subscribe({
      next: (res:any) => {
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

  openEditForm(data: any) {
        const dialogRef = this._dialog.open(BlogFormsComponent, {
          data,
        });
    
        dialogRef.afterClosed().subscribe({
          next: (val) => {
            if (val) {
              this.getCuriotoryBlog();
            }
          },
        });
      }

      deleteEntry(id:any){
        const confirmDelete = window.confirm('Do you want to delete this entry, Please Comfirm');
        if(confirmDelete){
          this.blog.deleteBlog(id).subscribe({
            next: (val: any) => {
              this._snackBar.open('Data Delete Successfully', 'Close', {
                duration: 3000,
              });
              window.location.reload();
            },
            error: (err: any) => {
             console.log(err);
            }
          })
          this.getCuriotoryBlog();
        }
      }


      isAdmin(): any{
        const token = this.loginService.getToken();
        if(token){
          return true;
        }

        return false;
      }
}
