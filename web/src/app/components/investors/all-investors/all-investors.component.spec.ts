import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInvestorsComponent } from './all-investors.component';

describe('AllInvestorsComponent', () => {
  let component: AllInvestorsComponent;
  let fixture: ComponentFixture<AllInvestorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllInvestorsComponent]
    });
    fixture = TestBed.createComponent(AllInvestorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
