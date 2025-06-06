import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedStartupsComponent } from './recommended-startups.component';

describe('RecommendedStartupsComponent', () => {
  let component: RecommendedStartupsComponent;
  let fixture: ComponentFixture<RecommendedStartupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedStartupsComponent]
    });
    fixture = TestBed.createComponent(RecommendedStartupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
