import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSelectedSheetComponent } from './final-selected-sheet.component';

describe('FinalSelectedSheetComponent', () => {
  let component: FinalSelectedSheetComponent;
  let fixture: ComponentFixture<FinalSelectedSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalSelectedSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalSelectedSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
