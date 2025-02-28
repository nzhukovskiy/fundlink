import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { genericResolver } from './generic.resolver';

describe('genericResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => genericResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
