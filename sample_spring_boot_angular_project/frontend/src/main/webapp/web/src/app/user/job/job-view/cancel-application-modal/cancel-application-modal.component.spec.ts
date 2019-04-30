import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelApplicationModalComponent } from './cancel-application-modal.component';

describe('CancelApplicationModalComponent', () => {
  let component: CancelApplicationModalComponent;
  let fixture: ComponentFixture<CancelApplicationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelApplicationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
