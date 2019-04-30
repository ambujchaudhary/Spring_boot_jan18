import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingPickerComponent } from './rating-picker.component';

describe('RatingPickerComponent', () => {
  let component: RatingPickerComponent;
  let fixture: ComponentFixture<RatingPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
