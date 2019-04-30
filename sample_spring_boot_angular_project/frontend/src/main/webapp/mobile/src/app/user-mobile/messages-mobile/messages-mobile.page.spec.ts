import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesMobilePage } from './messages-mobile.page';

describe('MessagesMobilePage', () => {
  let component: MessagesMobilePage;
  let fixture: ComponentFixture<MessagesMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
