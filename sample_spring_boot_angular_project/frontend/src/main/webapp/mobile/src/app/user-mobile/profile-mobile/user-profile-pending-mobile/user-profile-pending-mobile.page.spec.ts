import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilePendingMobilePage } from './user-profile-pending-mobile.page';

describe('UserProfilePendingMobilePage', () => {
  let component: UserProfilePendingMobilePage;
  let fixture: ComponentFixture<UserProfilePendingMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfilePendingMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilePendingMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
