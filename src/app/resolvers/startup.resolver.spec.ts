import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { startupResolver } from './startup.resolver';

describe('startupResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => startupResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
