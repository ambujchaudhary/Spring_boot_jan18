import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentDetailsComponent } from './manage-payment-details.component';

describe('ManagePaymentDetailsComponent', () => {
  let component: ManagePaymentDetailsComponent;
  let fixture: ComponentFixture<ManagePaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
