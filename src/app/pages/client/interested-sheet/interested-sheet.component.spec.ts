import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedSheetComponent } from './interested-sheet.component';

describe('InterestedSheetComponent', () => {
  let component: InterestedSheetComponent;
  let fixture: ComponentFixture<InterestedSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestedSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestedSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
