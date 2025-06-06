import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitNotificationComponent } from './exit-notification.component';

describe('ExitNotificationComponent', () => {
  let component: ExitNotificationComponent;
  let fixture: ComponentFixture<ExitNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExitNotificationComponent]
    });
    fixture = TestBed.createComponent(ExitNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
