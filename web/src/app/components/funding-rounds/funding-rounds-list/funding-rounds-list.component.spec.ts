import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingRoundsListComponent } from './funding-rounds-list.component';

describe('FundingRoundsListComponent', () => {
  let component: FundingRoundsListComponent;
  let fixture: ComponentFixture<FundingRoundsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundingRoundsListComponent]
    });
    fixture = TestBed.createComponent(FundingRoundsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
