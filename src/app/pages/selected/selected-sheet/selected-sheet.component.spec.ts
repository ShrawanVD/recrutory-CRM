import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSheetComponent } from './selected-sheet.component';

describe('SelectedSheetComponent', () => {
  let component: SelectedSheetComponent;
  let fixture: ComponentFixture<SelectedSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
