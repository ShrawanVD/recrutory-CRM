import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { LmscourseService } from '../services/lmscourse/lmscourse.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {

  courseForm: FormGroup;

  constructor(private fb: FormBuilder, private courseService: LmscourseService) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      language:['',Validators.required],
      thumbnail: ['', Validators.required],
      duration: ['', Validators.required],
      chapters: this.fb.array([])
    });
  }

  get chapters(): any {
    return this.courseForm.get('chapters') as FormArray;
  }

  addChapter() {
    const chapterForm = this.fb.group({
      title: ['', Validators.required],
      modules: this.fb.array([])
    });
    this.chapters.push(chapterForm);
  }

  removeChapter(index: number) {
    this.chapters.removeAt(index);
  }

  getModules(chapterIndex: number): any {
    return this.chapters.at(chapterIndex).get('modules') as FormArray;
  }

  addModule(chapterIndex: number) {
    const moduleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]  
      // desc: ['', Validators.required]
      // Resource: ['', Validators.required]
    });
    this.getModules(chapterIndex).push(moduleForm);
  }

  removeModule(chapterIndex: number, moduleIndex: number) {
    this.getModules(chapterIndex).removeAt(moduleIndex);
  }

  onSubmit() {
    if (this.courseForm.valid) {
      this.courseService.createCourse(this.courseForm.value).subscribe(response => {
        console.log('Course created:', response);
        alert("Course added successfully!!");
        window.location.reload();
      });
    }
  }
}
