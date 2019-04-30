import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSummaryFooterComponent } from './job-summary-footer.component';

describe('JobSummaryFooterComponent', () => {
  let component: JobSummaryFooterComponent;
  let fixture: ComponentFixture<JobSummaryFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSummaryFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSummaryFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
