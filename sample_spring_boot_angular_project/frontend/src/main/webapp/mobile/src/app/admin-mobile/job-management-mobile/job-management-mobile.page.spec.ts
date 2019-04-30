import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobManagementMobilePage } from './job-management-mobile.page';

describe('JobManagementMobilePage', () => {
  let component: JobManagementMobilePage;
  let fixture: ComponentFixture<JobManagementMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobManagementMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobManagementMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
