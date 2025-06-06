import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitStartupComponent } from './exit-startup.component';

describe('ExitStartupComponent', () => {
  let component: ExitStartupComponent;
  let fixture: ComponentFixture<ExitStartupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExitStartupComponent]
    });
    fixture = TestBed.createComponent(ExitStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
