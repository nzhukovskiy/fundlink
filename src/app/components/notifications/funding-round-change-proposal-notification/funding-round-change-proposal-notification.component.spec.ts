import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingRoundChangeProposalNotificationComponent } from './funding-round-change-proposal-notification.component';

describe('FundingRoundChangeProposalNotificationComponent', () => {
  let component: FundingRoundChangeProposalNotificationComponent;
  let fixture: ComponentFixture<FundingRoundChangeProposalNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundingRoundChangeProposalNotificationComponent]
    });
    fixture = TestBed.createComponent(FundingRoundChangeProposalNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
