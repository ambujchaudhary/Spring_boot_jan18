import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerUnavailableMobilePage } from './server-unavailable-mobile.page';

describe('ServerUnavailableMobilePage', () => {
  let component: ServerUnavailableMobilePage;
  let fixture: ComponentFixture<ServerUnavailableMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerUnavailableMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerUnavailableMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
