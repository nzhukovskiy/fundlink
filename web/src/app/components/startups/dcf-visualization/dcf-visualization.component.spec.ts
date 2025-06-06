import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcfVisualizationComponent } from './dcf-visualization.component';

describe('DcfVisualizationComponent', () => {
  let component: DcfVisualizationComponent;
  let fixture: ComponentFixture<DcfVisualizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DcfVisualizationComponent]
    });
    fixture = TestBed.createComponent(DcfVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
