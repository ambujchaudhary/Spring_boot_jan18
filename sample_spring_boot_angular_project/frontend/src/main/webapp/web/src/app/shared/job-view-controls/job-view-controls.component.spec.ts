import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewControlsComponent } from './job-view-controls.component';

describe('JobViewControlsComponent', () => {
  let component: JobViewControlsComponent;
  let fixture: ComponentFixture<JobViewControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobViewControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobViewControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
