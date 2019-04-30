import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsManagementEditComponent } from './jobs-management-edit.component';

describe('JobsManagementEditComponent', () => {
  let component: JobsManagementEditComponent;
  let fixture: ComponentFixture<JobsManagementEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsManagementEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsManagementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
