import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSheetComponent } from './client-sheet.component';

describe('ClientSheetComponent', () => {
  let component: ClientSheetComponent;
  let fixture: ComponentFixture<ClientSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
