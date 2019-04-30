import { Component, Input } from '@angular/core';

@Component({
  selector: 'zu-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {

  @Input() open = false;
  @Input() offset = 0;

  constructor() { }

}
