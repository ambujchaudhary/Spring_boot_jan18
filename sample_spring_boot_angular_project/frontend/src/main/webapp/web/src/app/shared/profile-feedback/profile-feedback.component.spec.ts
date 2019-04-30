import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFeedbackComponent } from './profile-feedback.component';

describe('ProfileFeedbackComponent', () => {
  let component: ProfileFeedbackComponent;
  let fixture: ComponentFixture<ProfileFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
