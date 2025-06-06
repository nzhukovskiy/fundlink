import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingRoundDeadlineNotificationComponent } from './funding-round-deadline-notification.component';

describe('FundingRoundDeadlineNotificationComponent', () => {
  let component: FundingRoundDeadlineNotificationComponent;
  let fixture: ComponentFixture<FundingRoundDeadlineNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundingRoundDeadlineNotificationComponent]
    });
    fixture = TestBed.createComponent(FundingRoundDeadlineNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
