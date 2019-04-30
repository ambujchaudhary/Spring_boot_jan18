import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobMobilePage } from './post-job-mobile.page';

describe('PostJobMobilePage', () => {
  let component: PostJobMobilePage;
  let fixture: ComponentFixture<PostJobMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
