import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedProcessSheetComponent } from './selected-process-sheet.component';

describe('SelectedProcessSheetComponent', () => {
  let component: SelectedProcessSheetComponent;
  let fixture: ComponentFixture<SelectedProcessSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedProcessSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedProcessSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
