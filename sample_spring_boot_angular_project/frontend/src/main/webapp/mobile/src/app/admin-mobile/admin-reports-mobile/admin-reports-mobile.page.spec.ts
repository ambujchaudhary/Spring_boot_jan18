import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsMobilePage } from './admin-reports-mobile.page';

describe('AdminReportsMobilePage', () => {
  let component: AdminReportsMobilePage;
  let fixture: ComponentFixture<AdminReportsMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReportsMobilePage ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
