import { TestBed } from '@angular/core/testing';

import { DropStatus } from './drop-status';

describe('DropStatus', () => {
  let service: DropStatus;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropStatus);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
