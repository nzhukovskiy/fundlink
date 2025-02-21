import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GotoChatComponent } from './goto-chat.component';

describe('GotoChatComponent', () => {
  let component: GotoChatComponent;
  let fixture: ComponentFixture<GotoChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GotoChatComponent]
    });
    fixture = TestBed.createComponent(GotoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
