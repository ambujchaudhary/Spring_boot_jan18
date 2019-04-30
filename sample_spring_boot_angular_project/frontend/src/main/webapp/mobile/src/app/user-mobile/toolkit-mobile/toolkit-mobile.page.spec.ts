import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolkitMobilePage } from './toolkit-mobile.page';

describe('ToolkitMobilePage', () => {
  let component: ToolkitMobilePage;
  let fixture: ComponentFixture<ToolkitMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolkitMobilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolkitMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
