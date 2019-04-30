import { Component, Input } from '@angular/core';

@Component({
  selector: 'zu-tooltip-group',
  templateUrl: './tooltip-group.component.html',
  styleUrls: ['./tooltip-group.component.scss'],
})
export class TooltipGroupComponent {

  @Input() message: string;
}
