import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewMobilePage } from './job-view-mobile.page';

describe('JobViewMobilePage', () => {
  let component: JobViewMobilePage;
  let fixture: ComponentFixture<JobViewMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobViewMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobViewMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
