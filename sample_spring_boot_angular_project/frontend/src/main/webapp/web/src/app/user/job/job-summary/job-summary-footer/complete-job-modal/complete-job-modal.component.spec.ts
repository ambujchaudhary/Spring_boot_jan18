import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteJobModalComponent } from './complete-job-modal.component';

describe('CompleteJobModalComponent', () => {
  let component: CompleteJobModalComponent;
  let fixture: ComponentFixture<CompleteJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
