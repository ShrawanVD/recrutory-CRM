import { TestBed } from '@angular/core/testing';

import { LmscourseService } from './lmscourse.service';

describe('LmscourseService', () => {
  let service: LmscourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmscourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
