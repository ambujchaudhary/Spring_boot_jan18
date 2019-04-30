import { Component, Input, OnInit } from '@angular/core';

export enum TooltipMode {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
}

export enum TooltipPosition {
  RIGHT = 'right',
  TOP = 'above',
}

@Component({
  selector: 'zu-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {

  @Input() message = '';
  @Input() mode = TooltipMode.DESKTOP;

  public position: TooltipPosition;
  public delay: number;

  private tooltipDelay = {
    none: 0,
    default: 3000,
  };

  constructor() { }

  ngOnInit() {
    if (this.mode === TooltipMode.MOBILE) {
      this.position = TooltipPosition.TOP;
      this.delay = this.tooltipDelay.default;
    } else {
      this.position = TooltipPosition.RIGHT;
      this.delay = this.tooltipDelay.none;
    }
  }

}
