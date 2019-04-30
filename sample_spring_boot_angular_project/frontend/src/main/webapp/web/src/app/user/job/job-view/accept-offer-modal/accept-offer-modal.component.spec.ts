import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptOfferModalComponent } from './accept-offer-modal.component';

describe('AcceptOfferModalComponent', () => {
  let component: AcceptOfferModalComponent;
  let fixture: ComponentFixture<AcceptOfferModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptOfferModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
