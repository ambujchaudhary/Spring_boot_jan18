import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileMobilePage } from './user-profile-mobile.page';

describe('UserProfileMobilePage', () => {
  let component: UserProfileMobilePage;
  let fixture: ComponentFixture<UserProfileMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
