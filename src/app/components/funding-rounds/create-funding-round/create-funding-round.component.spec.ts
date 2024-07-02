import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFundingRoundComponent } from './create-funding-round.component';

describe('CreateFundingRoundComponent', () => {
  let component: CreateFundingRoundComponent;
  let fixture: ComponentFixture<CreateFundingRoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFundingRoundComponent]
    });
    fixture = TestBed.createComponent(CreateFundingRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
