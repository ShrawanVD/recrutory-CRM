import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LmscourseService } from '../services/lmscourse/lmscourse.service';
import { FormControl } from '@angular/forms';
import { Course, Chapter } from '../models/course.module';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'language', 'thumbnail', 'duration', 'chapters'];
  dataSource = new MatTableDataSource<Course>();
  languageFilter = new FormControl('');

  constructor(private courseService: LmscourseService) {}

  ngOnInit(): void {
    this.fetchCourses();
    this.languageFilter.valueChanges.subscribe(value => {
      this.applyFilter(value ?? '');
    });
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.dataSource.data = courses;
      this.dataSource.filterPredicate = (data, filter) => {
        return data.language.trim().toLowerCase().includes(filter);
      };
    });
  }

  applyFilter(filterValue: string): void {
    console.log('Filtering with value:', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log('Filtered data:', this.dataSource.filteredData);
  }

  // toggleExpansion(course: Course): void {
  //   course.expanded = !course.expanded;
  // }

  // toggleChapterExpansion(chapter: Chapter): void {
  //   chapter.expanded = !chapter.expanded;
  // }
}
