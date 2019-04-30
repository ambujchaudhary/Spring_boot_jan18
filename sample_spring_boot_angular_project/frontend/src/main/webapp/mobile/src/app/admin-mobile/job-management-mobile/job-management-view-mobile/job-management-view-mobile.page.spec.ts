import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobManagementViewMobilePage } from './job-management-view-mobile.page';

describe('JobManagementViewMobilePage', () => {
  let component: JobManagementViewMobilePage;
  let fixture: ComponentFixture<JobManagementViewMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobManagementViewMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobManagementViewMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
