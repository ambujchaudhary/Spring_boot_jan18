import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsMobilePage } from './notifications-mobile.page';

describe('NotificationsMobilePage', () => {
  let component: NotificationsMobilePage;
  let fixture: ComponentFixture<NotificationsMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
