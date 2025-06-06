import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvestmentComponent } from './create-investment.component';

describe('CreateInvestmentComponent', () => {
  let component: CreateInvestmentComponent;
  let fixture: ComponentFixture<CreateInvestmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateInvestmentComponent]
    });
    fixture = TestBed.createComponent(CreateInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
