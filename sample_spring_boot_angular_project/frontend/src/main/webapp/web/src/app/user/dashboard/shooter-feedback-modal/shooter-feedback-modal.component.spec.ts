import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShooterFeedbackModalComponent } from './shooter-feedback-modal.component';

describe('ShooterFeedbackModalComponent', () => {
  let component: ShooterFeedbackModalComponent;
  let fixture: ComponentFixture<ShooterFeedbackModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShooterFeedbackModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShooterFeedbackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
