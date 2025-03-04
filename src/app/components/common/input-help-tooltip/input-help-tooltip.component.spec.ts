import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputHelpTooltipComponent } from './input-help-tooltip.component';

describe('InputHelpTooltipComponent', () => {
  let component: InputHelpTooltipComponent;
  let fixture: ComponentFixture<InputHelpTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputHelpTooltipComponent]
    });
    fixture = TestBed.createComponent(InputHelpTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
