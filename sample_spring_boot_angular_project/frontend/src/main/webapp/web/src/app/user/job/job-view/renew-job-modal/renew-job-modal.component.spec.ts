import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewJobModalComponent } from './renew-job-modal.component';

describe('RenewJobModalComponent', () => {
  let component: RenewJobModalComponent;
  let fixture: ComponentFixture<RenewJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
