import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleStartupComponent } from './single-startup.component';

describe('SingleStartupComponent', () => {
  let component: SingleStartupComponent;
  let fixture: ComponentFixture<SingleStartupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleStartupComponent]
    });
    fixture = TestBed.createComponent(SingleStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
