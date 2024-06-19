import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlogService } from '../services/blogs/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-forms',
  templateUrl: './blog-forms.component.html',
  styleUrls: ['./blog-forms.component.scss']
})
export class BlogFormsComponent implements OnInit{
  blogForm!: FormGroup;
  blogInfo: boolean = false;

  constructor(private _formBuilder: FormBuilder,private curiotoryBlog:BlogService,private _snackBar: MatSnackBar,private _fb: FormBuilder, private _dialogRef: MatDialogRef<BlogFormsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private router: Router){
    this.blogForm = this._formBuilder.group({
      title: [''],
      content: [''],
      intro: [''],
      imageUrl: [''],
      imageUrl2: ['']
    });
  }

  ngOnInit(): void {
    if(this.data){
      this.blogForm.patchValue(this.data);
      this.blogInfo = true;
    }
    
  }

  submitBlogs(){
    if(this.blogInfo){
      // for updating form
        this.curiotoryBlog.patchCuriotoryBlog(this.data.id,this.blogForm.value).subscribe({
          next: (val: any) => {
            this._snackBar.open('curiotory Blog Updated Successfully', 'Close', {
              duration: 3000,
            });
            window.location.reload();
          },
          error: (err: any) => {
            this._snackBar.open('curiotory Blog Not Updated', 'Close', {
              duration: 3000,
            });
          }
        })

    }else{

      // for adding new data
      if(this.blogForm.value.content){
        this.curiotoryBlog.postCuriotoryBlog(this.blogForm.value).subscribe({
          next: (val: any) => {
            this._snackBar.open('Form Submitted Successfully', 'Close', {
              duration: 3000,
            });
            this._dialogRef.close([]);
            window.location.reload();
          },
          error: (err: any) => {
            this._snackBar.open('Form Submitted Successfully', 'Close', {
              duration: 3000,
            });
            this._dialogRef.close([]);
            window.location.reload();
          }
        })
      }else{
        this._snackBar.open('Please fill the form', 'Close', {
          duration: 3000,
        });
      }

      // this.curiotoryBlog.postCuriotoryBlog(this.blogForm.value).subscribe({
      //   next: (val: any) => {
      //     this._snackBar.open('Form Submitted Successfully', 'Close', {
      //       duration: 3000,
      //     });
      //     window.location.reload();
      //   },
      //   error: (err: any) => {
      //     this._snackBar.open('Error submitting form', 'Close', {
      //       duration: 3000,
      //     });
      //     console.error(err);
      //   }
      // });


    }
  }

}
