import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFundingRoundComponent } from './single-funding-round.component';

describe('SingleFundingRoundComponent', () => {
  let component: SingleFundingRoundComponent;
  let fixture: ComponentFixture<SingleFundingRoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleFundingRoundComponent]
    });
    fixture = TestBed.createComponent(SingleFundingRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
