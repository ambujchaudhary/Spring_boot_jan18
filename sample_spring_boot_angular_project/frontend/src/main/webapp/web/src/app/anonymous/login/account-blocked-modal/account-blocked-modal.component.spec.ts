import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBlockedModalComponent } from './account-blocked-modal.component';

describe('AccountBlockedModalComponent', () => {
  let component: AccountBlockedModalComponent;
  let fixture: ComponentFixture<AccountBlockedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBlockedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBlockedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
