import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMobilePage } from './register-mobile.page';

describe('RegisterMobilePage', () => {
  let component: RegisterMobilePage;
  let fixture: ComponentFixture<RegisterMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
