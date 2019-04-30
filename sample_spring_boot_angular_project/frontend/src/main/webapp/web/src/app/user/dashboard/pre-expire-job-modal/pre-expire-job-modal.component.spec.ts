import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreExpireJobModalComponent } from './pre-expire-job-modal.component';

describe('PreExpireJobModalComponent', () => {
  let component: PreExpireJobModalComponent;
  let fixture: ComponentFixture<PreExpireJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreExpireJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreExpireJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
