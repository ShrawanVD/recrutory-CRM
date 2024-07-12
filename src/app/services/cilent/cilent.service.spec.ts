import { TestBed } from '@angular/core/testing';

import { CilentService } from './cilent.service';

describe('CilentService', () => {
  let service: CilentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CilentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
