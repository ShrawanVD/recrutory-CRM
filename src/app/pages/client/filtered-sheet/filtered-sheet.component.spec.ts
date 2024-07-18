import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredSheetComponent } from './filtered-sheet.component';

describe('InterestedSheetComponent', () => {
  let component: FilteredSheetComponent;
  let fixture: ComponentFixture<FilteredSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilteredSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteredSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
