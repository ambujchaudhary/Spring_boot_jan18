import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelJobModalComponent } from './cancel-job-modal.component';

describe('CancelJobModalComponent', () => {
  let component: CancelJobModalComponent;
  let fixture: ComponentFixture<CancelJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
