import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentNotificationComponent } from './investment-notification.component';

describe('InvestmentNotificationComponent', () => {
  let component: InvestmentNotificationComponent;
  let fixture: ComponentFixture<InvestmentNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentNotificationComponent]
    });
    fixture = TestBed.createComponent(InvestmentNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
