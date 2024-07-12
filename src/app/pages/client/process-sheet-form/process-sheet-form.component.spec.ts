import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessSheetFormComponent } from './process-sheet-form.component';

describe('ProcessSheetFormComponent', () => {
  let component: ProcessSheetFormComponent;
  let fixture: ComponentFixture<ProcessSheetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessSheetFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessSheetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
