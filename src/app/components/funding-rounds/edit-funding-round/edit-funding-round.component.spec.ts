import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFundingRoundComponent } from './edit-funding-round.component';

describe('EditFundingRoundComponent', () => {
  let component: EditFundingRoundComponent;
  let fixture: ComponentFixture<EditFundingRoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditFundingRoundComponent]
    });
    fixture = TestBed.createComponent(EditFundingRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
