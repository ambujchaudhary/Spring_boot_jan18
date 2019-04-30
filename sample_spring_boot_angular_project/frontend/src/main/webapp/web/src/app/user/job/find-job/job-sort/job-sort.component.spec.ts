import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSortComponent } from './job-sort.component';

describe('JobSortComponent', () => {
  let component: JobSortComponent;
  let fixture: ComponentFixture<JobSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
