import { Directive, HostListener, Injector, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavIntent } from '@ionic/angular/dist/providers/nav-controller';

@Directive({
  selector: '[zuRouterDirection]'
})
export class RouterDirectionDirective {

  @Input() zuRouterDirection: 'forward' | 'back' | 'root' | undefined;

  private navCtrl: NavController;

  public static textToIntent(direction: string) {
    switch (direction) {
      case 'forward':
        return NavIntent.Forward;
      case 'back':
        return NavIntent.Back;
      case 'root':
        return NavIntent.Root;
      default:
        return NavIntent.Auto;
    }
  }

  constructor(
      private injector: Injector
  ) {

    try {
      this.navCtrl = injector.get(NavController);
    } catch (e) {
    }
  }

  @HostListener('click')
  public onClick() {
    if (this.navCtrl && this.navCtrl.setIntent) {
      try {
        this.navCtrl.setIntent(RouterDirectionDirective.textToIntent(this.zuRouterDirection));
      } catch (e) {
      }
    }
  }

}
