import { Directive, Injector, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[zumBrowserOnly]'
})
export class BrowserOnlyDirective {

  private platform: Platform;

  constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  //  TODO
  @Input() set zumBrowserOnly(isBrowser: boolean) {
    try {
      if (this.platform.is('mobile')) {
        this.viewContainer.clear();
      } else {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } catch (e) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }

  }

}
