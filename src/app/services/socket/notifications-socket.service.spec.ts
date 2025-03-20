import { TestBed } from '@angular/core/testing';

import { NotificationsSocketService } from './notifications-socket.service';

describe('NotificationsSocketService', () => {
  let service: NotificationsSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
