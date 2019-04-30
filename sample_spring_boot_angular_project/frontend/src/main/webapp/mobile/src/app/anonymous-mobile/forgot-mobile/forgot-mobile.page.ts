import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'zum-forgot-mobile',
  templateUrl: './forgot-mobile.page.html',
  styleUrls: ['./forgot-mobile.page.scss'],
})
export class ForgotMobilePage implements OnInit {

  constructor(
      private keyboard: Keyboard
  ) { }

  ngOnInit() {
  }

  public hideKeyboard(): void {
    if (this.keyboard.isVisible === true) {
      this.keyboard.hide();
    } else {
      return;
    }
  }
}
