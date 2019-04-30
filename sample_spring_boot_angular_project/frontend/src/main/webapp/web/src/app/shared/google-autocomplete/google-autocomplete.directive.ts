import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GoogleAutocompleteResult } from './google-autocomplete.model';

declare var google: {maps?: any};

@Directive({
  selector: '[zuGoogleAutocomplete]',
  providers: [NgModel],
  host: {'(input)': 'onInputChange()'},
})
export class GoogleAutocompleteDirective {

  @Output() setAddress: EventEmitter<any> = new EventEmitter();

  modelValue: any;
  autocomplete: any;

  private _el: HTMLInputElement;

  private options = {types: ['(cities)']};

  constructor(el: ElementRef, private model: NgModel) {
    this._el = el.nativeElement;
    this.modelValue = this.model;

    const intervalId = setInterval(
        () => {
          if (google && google.maps) {
            clearInterval(intervalId);
            this.init();
          }
        },
        10);

  }

  private init() {
    const input = this._el;
    this.autocomplete = new google.maps.places.Autocomplete(input, this.options);

    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      const place = this.autocomplete.getPlace();
      this.invokeEvent(place);
    });
  }

  private invokeEvent(place: any) {
    this.setAddress.emit(new GoogleAutocompleteResult(this._el.value, place));
  }

  onInputChange() {
    const emptyPlace = {
      geometry: {
        location: {
          lng() {},
          lat() {}
        }
      }
    };

    const d = new GoogleAutocompleteResult('', emptyPlace);
    this.setAddress.emit(d);
    // TODO refactor
    event.stopPropagation();
    event.preventDefault();
  }
}
