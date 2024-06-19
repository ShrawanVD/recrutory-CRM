import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFormsComponent } from './blog-forms.component';

describe('BlogFormsComponent', () => {
  let component: BlogFormsComponent;
  let fixture: ComponentFixture<BlogFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogFormsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
