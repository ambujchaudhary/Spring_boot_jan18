import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineOfferModalComponent } from './decline-offer-modal.component';

describe('DeclineOfferModalComponent', () => {
  let component: DeclineOfferModalComponent;
  let fixture: ComponentFixture<DeclineOfferModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclineOfferModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclineOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
