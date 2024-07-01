import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorPageComponent } from './investor-page.component';

describe('InvestorPageComponent', () => {
  let component: InvestorPageComponent;
  let fixture: ComponentFixture<InvestorPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestorPageComponent]
    });
    fixture = TestBed.createComponent(InvestorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
