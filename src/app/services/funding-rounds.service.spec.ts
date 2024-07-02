import { TestBed } from '@angular/core/testing';

import { FundingRoundsService } from './funding-rounds.service';

describe('FundingRoundsService', () => {
  let service: FundingRoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundingRoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
