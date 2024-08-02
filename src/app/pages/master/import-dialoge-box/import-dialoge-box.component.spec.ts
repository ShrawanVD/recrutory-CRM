import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDialogeBoxComponent } from './import-dialoge-box.component';

describe('ImportDialogeBoxComponent', () => {
  let component: ImportDialogeBoxComponent;
  let fixture: ComponentFixture<ImportDialogeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDialogeBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportDialogeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
