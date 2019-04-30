import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIconsComponent } from './svg-icons.component';

describe('SvgIconsComponent', () => {
  let component: SvgIconsComponent;
  let fixture: ComponentFixture<SvgIconsComponent>;
  let originalTimeout;

  beforeEach(async(() => {

    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    TestBed.configureTestingModule({
      declarations: [SvgIconsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    done();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
