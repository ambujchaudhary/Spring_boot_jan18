import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSummaryDateComponent } from './job-summary-date.component';

describe('JobSummaryDateComponent', () => {
  let component: JobSummaryDateComponent;
  let fixture: ComponentFixture<JobSummaryDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSummaryDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSummaryDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
