import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { TooltipComponent } from './tooltip.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltip, MatTooltipModule } from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  let tooltipDirective: MatTooltip;
  let divDebugElement: DebugElement;
  let divElement: HTMLDivElement;
  let svgDebugElement: DebugElement;
  let svgElement: SVGElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTooltipModule, OverlayModule, NoopAnimationsModule],
      declarations: [TooltipComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    divDebugElement = fixture.debugElement.query(By.css('.tooltip-box'));
    divElement = <HTMLDivElement> divDebugElement.nativeElement;
    svgDebugElement = fixture.debugElement.query(By.css('.tooltip-box > svg'));
    svgElement = <SVGElement> svgDebugElement.nativeElement;
    tooltipDirective = divDebugElement.injector.get<MatTooltip>(MatTooltip);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be unset the tooltip message by default', fakeAsync(() => {
    fixture.detectChanges();
    tooltipDirective.show();
    assertTooltipInstance(tooltipDirective, false);

    expect(tooltipDirective.message).toBe('');
  }));

  it('should not show tooltip if message is not present or empty', () => {
    assertTooltipInstance(tooltipDirective, false);

    tooltipDirective.message = undefined!;
    fixture.detectChanges();
    tooltipDirective.show();
    assertTooltipInstance(tooltipDirective, false);

    tooltipDirective.message = null!;
    fixture.detectChanges();
    tooltipDirective.show();
    assertTooltipInstance(tooltipDirective, false);

    tooltipDirective.message = '';
    fixture.detectChanges();
    tooltipDirective.show();
    assertTooltipInstance(tooltipDirective, false);

    tooltipDirective.message = '   ';
    fixture.detectChanges();
    tooltipDirective.show();
    assertTooltipInstance(tooltipDirective, false);
  });

  it('should be able to set the tooltip message as a text', fakeAsync(() => {
    const message = 'tooltip message';
    fixture.componentInstance.message = message;
    fixture.detectChanges();

    expect(tooltipDirective.message).toBe(message);
  }));

  it('should content svg icon', fakeAsync(() => {
    fixture.detectChanges();
    expect(svgElement).not.toBeNull();
  }));
});

/** Asserts whether a tooltip directive has a tooltip instance. */
function assertTooltipInstance(tooltip: MatTooltip, shouldExist: boolean): void {
  // Note that we have to cast this to a boolean, because Jasmine will go into an infinite loop
  // if it tries to stringify the `_tooltipInstance` when an assertion fails. The infinite loop
  // happens due to the `_tooltipInstance` having a circular structure.
  expect(!!tooltip._tooltipInstance).toBe(shouldExist);
}