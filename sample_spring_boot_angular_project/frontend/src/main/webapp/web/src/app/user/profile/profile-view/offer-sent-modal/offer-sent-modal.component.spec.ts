import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSentModalComponent } from './offer-sent-modal.component';

describe('OfferSentModalComponent', () => {
  let component: OfferSentModalComponent;
  let fixture: ComponentFixture<OfferSentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferSentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
