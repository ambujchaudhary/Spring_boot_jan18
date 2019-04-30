import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyMembershipModalComponent } from './buy-membership-modal.component';

describe('BuyMembershipModalComponent', () => {
  let component: BuyMembershipModalComponent;
  let fixture: ComponentFixture<BuyMembershipModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyMembershipModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyMembershipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
