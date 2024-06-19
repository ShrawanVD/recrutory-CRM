import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { LessonService } from 'src/app/services/lesson/lesson.service';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss']
})
export class AddLessonComponent {
  constructor(
    public dialogRef: MatDialogRef<DashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) { }

  addVideo(): void {
    const videos = this.data.form.get('videos') as FormArray;
    videos.push(this.fb.group({
      title: [''],
      url: ['']
    }));
  }

  removeVideo(index: number): void {
    const videos = this.data.form.get('videos') as FormArray;
    videos.removeAt(index);
  }

  onSubmit(): void {
    this.dialogRef.close(this.data.form.value);
  }

  // onSubmit(): void {
  //   // this.lessonService.addLesson(this.data.form.value).subscribe({
  //   //   next: (val: any) => {
  //   //     this._snackBar.open('Lesson added Successfully', 'Close', {
  //   //       duration: 3000,
  //   //     });
  //   //     this.dialogRef.close([]);
  //   //     // window.location.reload();
  //   //   },
  //   //   error: (err: any) => {
  //   //     console.log(err);
  //   //   }
  //   // })
  //   this.dialogRef.close(this.data.form.value);
  //   this._snackBar.open('Lesson added Successfully', 'Close', {
  //     duration: 3000,
  //   });
  // }

}
