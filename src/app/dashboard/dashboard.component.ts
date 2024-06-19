import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { LessonService } from '../services/lesson/lesson.service';
import { AddLessonComponent } from '../components/add-lesson/add-lesson.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  lessons: MatTableDataSource<any> = new MatTableDataSource();
  lessonForm: FormGroup;
  displayedColumns: string[] = [
    'lessonNumber',
    'language',
    'level',
    'lessonTitle',
    'videos',
    'videosurl',
    'action'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private lessonService: LessonService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.lessonForm = this.fb.group({
      language: [''],
      level: [''],
      lessonNumber: [''],
      lessonTitle: [''],
      videos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadLessons();
  }

  ngAfterViewInit() {
    this.lessons.paginator = this.paginator;
  }

  loadLessons(): void {
    this.lessonService.getLessons().subscribe((data: any) => {
      this.lessons.data = data;
    });
  }

  openFormDialog(isEdit: boolean = false, lessonData?: any): void {
    if (isEdit && lessonData) {
      this.lessonForm.patchValue({
        language: lessonData.language,
        level: lessonData.level,
        lessonNumber: lessonData.lessonNumber,
        lessonTitle: lessonData.lessonTitle
      });

      const videos = this.lessonForm.get('videos') as FormArray;
      videos.clear();
      lessonData.videos.forEach((video: any) => {
        videos.push(this.fb.group({
          title: video.title,
          url: video.url
        }));
      });
    } else {
      this.lessonForm.reset();
      const videos = this.lessonForm.get('videos') as FormArray;
      videos.clear();
    }

    const dialogRef = this.dialog.open(AddLessonComponent, {
      width: '1000px',
      data: { form: this.lessonForm, isEdit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isEdit) {
          this.lessonService.updateLesson(lessonData._id, result).subscribe(() => {
            this.loadLessons();
          });
        } else {
          this.lessonService.addLesson(result).subscribe(() => {
            this.loadLessons();
          });
        }
      }
    });
  }


}
