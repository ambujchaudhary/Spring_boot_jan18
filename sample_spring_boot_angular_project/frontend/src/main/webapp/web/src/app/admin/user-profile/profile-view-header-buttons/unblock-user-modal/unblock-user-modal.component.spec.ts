import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnblockUserModalComponent } from './unblock-user-modal.component';

describe('UnblockUserModalComponent', () => {
  let component: UnblockUserModalComponent;
  let fixture: ComponentFixture<UnblockUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnblockUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnblockUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
