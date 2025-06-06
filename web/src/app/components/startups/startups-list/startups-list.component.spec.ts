import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupsListComponent } from './startups-list.component';

describe('StartupsListComponent', () => {
  let component: StartupsListComponent;
  let fixture: ComponentFixture<StartupsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartupsListComponent]
    });
    fixture = TestBed.createComponent(StartupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
