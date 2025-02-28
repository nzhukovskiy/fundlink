import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { fundingRoundResolver } from './funding-round.resolver';

describe('fundingRoundResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => fundingRoundResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
