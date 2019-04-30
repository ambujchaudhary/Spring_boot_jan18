import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'zu-toolkit',
  templateUrl: './toolkit.component.html',
  styleUrls: ['./toolkit.component.scss']
})
export class ToolkitComponent {
  @ViewChild('frame') frame: ElementRef;
  private mouseOverFrame = false;

  @HostListener('window:blur')
  private onWindowBlur(): void {
    if (this.mouseOverFrame) {
      this.frame.nativeElement.click();
    }
  }

  public onMouseOver(): void {
    this.mouseOverFrame = true;
  }

  public onMouseOut(): void {
    this.mouseOverFrame = false;
  }

}
