import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutMobilePage } from './logout-mobile.page';

describe('LogoutMobilePage', () => {
  let component: LogoutMobilePage;
  let fixture: ComponentFixture<LogoutMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
