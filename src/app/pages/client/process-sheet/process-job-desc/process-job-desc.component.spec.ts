import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessJobDescComponent } from './process-job-desc.component';

describe('ProcessJobDescComponent', () => {
  let component: ProcessJobDescComponent;
  let fixture: ComponentFixture<ProcessJobDescComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessJobDescComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessJobDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
