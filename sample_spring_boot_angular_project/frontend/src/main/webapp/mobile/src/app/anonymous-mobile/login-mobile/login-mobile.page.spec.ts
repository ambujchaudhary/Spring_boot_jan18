import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMobilePage } from './login-mobile.page';

describe('LoginMobilePage', () => {
  let component: LoginMobilePage;
  let fixture: ComponentFixture<LoginMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
