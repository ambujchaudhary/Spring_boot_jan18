import { Component } from '@angular/core';

@Component({
  selector: 'zu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor() {}

  public onActivate(event) {

    const scrollToTop = window.setInterval(
        () => {
          const pos = window.pageYOffset;
          if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
          } else {
            window.clearInterval(scrollToTop);
          }
        },
        0);
  }
}
