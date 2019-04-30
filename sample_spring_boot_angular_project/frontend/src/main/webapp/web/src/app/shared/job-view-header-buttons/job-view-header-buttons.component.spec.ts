import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewHeaderButtonsComponent } from './job-view-header-buttons.component';

describe('JobViewHeaderButtonsComponent', () => {
  let component: JobViewHeaderButtonsComponent;
  let fixture: ComponentFixture<JobViewHeaderButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobViewHeaderButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobViewHeaderButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
