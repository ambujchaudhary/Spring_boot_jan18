import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipDetailsModalComponent } from './membership-details-modal.component';

describe('MembershipDetailsModalComponent', () => {
  let component: MembershipDetailsModalComponent;
  let fixture: ComponentFixture<MembershipDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
