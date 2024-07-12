import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CilentPocComponent } from './cilent-poc.component';

describe('CilentPocComponent', () => {
  let component: CilentPocComponent;
  let fixture: ComponentFixture<CilentPocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CilentPocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CilentPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
