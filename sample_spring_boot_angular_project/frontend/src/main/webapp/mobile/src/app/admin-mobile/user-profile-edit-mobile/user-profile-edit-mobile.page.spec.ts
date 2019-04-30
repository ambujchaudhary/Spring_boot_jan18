import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileEditMobilePage } from './user-profile-edit-mobile.page';

describe('UserProfileEditMobilePage', () => {
  let component: UserProfileEditMobilePage;
  let fixture: ComponentFixture<UserProfileEditMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileEditMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileEditMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
