import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMessagesComponent } from './header-messages.component';

describe('HeaderMessagesComponent', () => {
  let component: HeaderMessagesComponent;
  let fixture: ComponentFixture<HeaderMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
