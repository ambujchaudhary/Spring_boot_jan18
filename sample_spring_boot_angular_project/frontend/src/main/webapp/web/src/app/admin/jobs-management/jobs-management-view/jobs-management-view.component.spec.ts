import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsManagementViewComponent } from './jobs-management-view.component';

describe('JobsManagementViewComponent', () => {
  let component: JobsManagementViewComponent;
  let fixture: ComponentFixture<JobsManagementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsManagementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsManagementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
