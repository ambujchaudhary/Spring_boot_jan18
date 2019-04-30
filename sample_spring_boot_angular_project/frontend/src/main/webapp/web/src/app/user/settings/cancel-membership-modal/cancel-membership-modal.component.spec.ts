import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelMembershipModalComponent } from './cancel-membership-modal.component';

describe('CancelMembershipModalComponent', () => {
  let component: CancelMembershipModalComponent;
  let fixture: ComponentFixture<CancelMembershipModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelMembershipModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelMembershipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
