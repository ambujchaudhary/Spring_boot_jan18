import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsMobilePage } from './jobs-mobile.page';

describe('JobsMobilePage', () => {
  let component: JobsMobilePage;
  let fixture: ComponentFixture<JobsMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
