import { TestBed } from '@angular/core/testing';

import { RemoteFileService } from './remote-file.service';

describe('RemoteFileService', () => {
  let service: RemoteFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
