import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCountryMobilePage } from './choose-country-mobile.page';

describe('ChooseCountryMobilePage', () => {
  let component: ChooseCountryMobilePage;
  let fixture: ComponentFixture<ChooseCountryMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCountryMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCountryMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
