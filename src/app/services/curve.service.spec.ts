import { TestBed } from '@angular/core/testing';

import { CurveService } from './curve.service';

describe('CurveService', () => {
  let service: CurveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
