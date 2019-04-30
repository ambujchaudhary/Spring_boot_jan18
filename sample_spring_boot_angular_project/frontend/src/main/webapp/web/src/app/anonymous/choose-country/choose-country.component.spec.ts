import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCountryComponent } from './choose-country.component';

describe('ChooseCountryComponent', () => {
  let component: ChooseCountryComponent;
  let fixture: ComponentFixture<ChooseCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
