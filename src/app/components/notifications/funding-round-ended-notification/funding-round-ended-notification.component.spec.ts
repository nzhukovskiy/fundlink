import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingRoundEndedNotificationComponent } from './funding-round-ended-notification.component';

describe('FundingRoundEndedNotificationComponent', () => {
  let component: FundingRoundEndedNotificationComponent;
  let fixture: ComponentFixture<FundingRoundEndedNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundingRoundEndedNotificationComponent]
    });
    fixture = TestBed.createComponent(FundingRoundEndedNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
