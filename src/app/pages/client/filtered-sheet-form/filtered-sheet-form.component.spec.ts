import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedSheetFormComponent } from './filtered-sheet-form.component';

describe('InterestedSheetFormComponent', () => {
  let component: InterestedSheetFormComponent;
  let fixture: ComponentFixture<InterestedSheetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestedSheetFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestedSheetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
