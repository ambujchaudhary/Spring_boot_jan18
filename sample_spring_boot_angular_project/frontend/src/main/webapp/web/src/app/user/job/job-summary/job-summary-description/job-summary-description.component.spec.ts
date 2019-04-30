import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSummaryDescriptionComponent } from './job-summary-description.component';

describe('JobSummaryDescriptionComponent', () => {
  let component: JobSummaryDescriptionComponent;
  let fixture: ComponentFixture<JobSummaryDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSummaryDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSummaryDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
