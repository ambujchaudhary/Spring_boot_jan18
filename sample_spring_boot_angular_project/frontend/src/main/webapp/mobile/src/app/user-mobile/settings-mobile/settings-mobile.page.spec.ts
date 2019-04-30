import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMobilePage } from './settings-mobile.page';

describe('SettingsMobilePage', () => {
  let component: SettingsMobilePage;
  let fixture: ComponentFixture<SettingsMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
