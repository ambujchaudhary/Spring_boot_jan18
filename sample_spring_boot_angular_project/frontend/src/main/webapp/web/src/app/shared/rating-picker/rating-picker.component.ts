import { Component, Input } from '@angular/core';

@Component({
  selector: 'zu-rating-picker',
  templateUrl: './rating-picker.component.html',
  styleUrls: ['./rating-picker.component.scss']
})
export class RatingPickerComponent {

  @Input() pickerClass: string;

  constructor() { }
}
