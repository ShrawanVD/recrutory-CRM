import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPocComponent } from './process-poc.component';

describe('ProcessPocComponent', () => {
  let component: ProcessPocComponent;
  let fixture: ComponentFixture<ProcessPocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessPocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
