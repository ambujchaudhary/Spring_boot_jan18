import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GoogleAutocompleteDirective } from './google-autocomplete.directive';
import { GoogleAutocompleteResult } from './google-autocomplete.model';

declare var window: any;

window.google = {
  maps: {
    places: {
      Autocomplete() {
        return true;
      },
    },
  },
};

@Component({
  template: `
    <input type="text" zuGoogleAutocomplete (setAddress)="setAddressCallback($event)">
    <label>
      <span *ngIf="isCallbackWasColl">true</span>
      <span *ngIf="!isCallbackWasColl">false</span>
    </label>
  `,
})
class TestGoogleAutocompleteComponent {
  isCallbackWasColl = false;

  constructor() {
  }

  setAddressCallback(responseData?: GoogleAutocompleteResult) {
    this.isCallbackWasColl = true;

    if (typeof responseData === 'object' && typeof responseData.input === 'string' && responseData.place) {
      return true;
    } else {
      return false;
    }
  }
}

describe('GoogleAutocompleteDirective', () => {

  let component: TestGoogleAutocompleteComponent;
  let fixture: ComponentFixture<TestGoogleAutocompleteComponent>;
  let inputEl: DebugElement;
  let labelEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestGoogleAutocompleteComponent, GoogleAutocompleteDirective],
    });

    fixture = TestBed.createComponent(TestGoogleAutocompleteComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    labelEl = fixture.debugElement.query(By.css('label'));
  });

  it('should be empty after init', () => {
    expect(inputEl.nativeElement.value.trim()).toBe('');
  });

  it('should call callback function after changes', () => {
    fixture.detectChanges();
    expect(labelEl.nativeElement.textContent.trim()).toBe('false');
    inputEl.nativeElement.value = 'Test';
    inputEl.triggerEventHandler('input', null);
    fixture.detectChanges();
    component.setAddressCallback();
    fixture.detectChanges();
    expect(labelEl.nativeElement.textContent.trim()).toBe('true');
  });
});
