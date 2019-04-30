import { Component, Input } from '@angular/core';

type IntroHeaderBackground = 1 | 2 | 3 | 4;
type IntroHeaderTitleSize = 'M' | 'L';

@Component({
  selector: 'zu-intro-header',
  templateUrl: './intro-header.component.html',
  styleUrls: ['./intro-header.component.scss'],
})
export class IntroHeaderComponent {

  @Input() title = '';
  @Input() subTitle = '';
  @Input() description = '';
  @Input() background: IntroHeaderBackground;
  @Input() titleSize: IntroHeaderTitleSize;

  @Input() isLogoVisible = false;
  @Input() offset = true;
}
