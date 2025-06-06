import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostFundedStartupsComponent } from './most-funded-startups.component';

describe('MostFundedStartupsComponent', () => {
  let component: MostFundedStartupsComponent;
  let fixture: ComponentFixture<MostFundedStartupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MostFundedStartupsComponent]
    });
    fixture = TestBed.createComponent(MostFundedStartupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
