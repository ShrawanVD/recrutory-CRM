import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSheetFormComponent } from './client-sheet-form.component';

describe('ClientSheetFormComponent', () => {
  let component: ClientSheetFormComponent;
  let fixture: ComponentFixture<ClientSheetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSheetFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSheetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
