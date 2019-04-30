import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindJobMobilePage } from './find-job-mobile.page';

describe('FindJobMobilePage', () => {
  let component: FindJobMobilePage;
  let fixture: ComponentFixture<FindJobMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindJobMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindJobMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
