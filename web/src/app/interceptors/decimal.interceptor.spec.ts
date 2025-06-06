import { TestBed } from '@angular/core/testing';

import { DecimalInterceptor } from './decimal.interceptor';

describe('DecimalInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DecimalInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: DecimalInterceptor = TestBed.inject(DecimalInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
