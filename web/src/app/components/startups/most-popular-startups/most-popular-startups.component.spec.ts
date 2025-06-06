import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostPopularStartupsComponent } from './most-popular-startups.component';

describe('MostPopularStartupsComponent', () => {
  let component: MostPopularStartupsComponent;
  let fixture: ComponentFixture<MostPopularStartupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MostPopularStartupsComponent]
    });
    fixture = TestBed.createComponent(MostPopularStartupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
