import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobManagementEditMobilePage } from './job-management-edit-mobile.page';

describe('JobManagementEditMobilePage', () => {
  let component: JobManagementEditMobilePage;
  let fixture: ComponentFixture<JobManagementEditMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobManagementEditMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobManagementEditMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
