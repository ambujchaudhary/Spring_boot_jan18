import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSummaryHeaderComponent } from './job-summary-header.component';

describe('JobSummaryHeaderComponent', () => {
  let component: JobSummaryHeaderComponent;
  let fixture: ComponentFixture<JobSummaryHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSummaryHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSummaryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
