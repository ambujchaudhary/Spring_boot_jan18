import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotMobilePage } from './forgot-mobile.page';

describe('ForgotMobilePage', () => {
  let component: ForgotMobilePage;
  let fixture: ComponentFixture<ForgotMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
