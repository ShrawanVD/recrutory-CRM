import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSheetFormComponent } from './master-sheet-form.component';

describe('MasterSheetFormComponent', () => {
  let component: MasterSheetFormComponent;
  let fixture: ComponentFixture<MasterSheetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSheetFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSheetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
