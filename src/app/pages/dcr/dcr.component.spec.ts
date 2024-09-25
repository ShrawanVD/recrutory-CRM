import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcrComponent } from './dcr.component';

describe('DcrComponent', () => {
  let component: DcrComponent;
  let fixture: ComponentFixture<DcrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
