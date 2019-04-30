import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSentModalComponent } from './application-sent-modal.component';

describe('ApplicationSentModalComponent', () => {
  let component: ApplicationSentModalComponent;
  let fixture: ComponentFixture<ApplicationSentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationSentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationSentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
