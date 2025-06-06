import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { investorResolver } from './investor.resolver';

describe('investorResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => investorResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
