import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearableSelectComponent } from './clearable-select.component';

describe('ClearableSelectComponent', () => {
  let component: ClearableSelectComponent;
  let fixture: ComponentFixture<ClearableSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClearableSelectComponent]
    });
    fixture = TestBed.createComponent(ClearableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
