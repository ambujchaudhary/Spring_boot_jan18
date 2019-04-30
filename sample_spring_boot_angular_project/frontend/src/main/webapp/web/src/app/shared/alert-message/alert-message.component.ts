import { Component, Input } from '@angular/core';

@Component({
  selector: 'zu-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
})
export class AlertMessageComponent {

  @Input() title = '';
  @Input() daysToExpire: number;

  constructor() { }
}
