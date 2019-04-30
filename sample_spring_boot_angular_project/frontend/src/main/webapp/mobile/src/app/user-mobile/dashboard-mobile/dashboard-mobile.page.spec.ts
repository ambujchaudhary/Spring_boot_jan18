import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMobilePage } from './dashboard-mobile.page';

describe('DashboardMobilePage', () => {
  let component: DashboardMobilePage;
  let fixture: ComponentFixture<DashboardMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
