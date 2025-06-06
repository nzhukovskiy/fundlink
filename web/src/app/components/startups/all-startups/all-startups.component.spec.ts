import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStartupsComponent } from './all-startups.component';

describe('AllStartupsComponent', () => {
  let component: AllStartupsComponent;
  let fixture: ComponentFixture<AllStartupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllStartupsComponent]
    });
    fixture = TestBed.createComponent(AllStartupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
