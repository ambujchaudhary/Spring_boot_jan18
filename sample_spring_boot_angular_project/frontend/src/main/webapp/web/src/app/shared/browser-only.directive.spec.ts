import { Injector, TemplateRef, ViewContainerRef } from '@angular/core';
import { BrowserOnlyDirective } from './browser-only.directive';

describe('BrowserOnlyDirective', () => {
  it('should create an instance', () => {
    const directive = new BrowserOnlyDirective(
        {
          provide: TemplateRef
        },
        {
          provide: Injector
        },
        {
          provide: ViewContainerRef
        }
    );
    expect(directive).toBeTruthy();
  });
});
