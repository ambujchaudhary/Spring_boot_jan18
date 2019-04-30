import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zu-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {

  private defaultSliderAutoPLaySpeed = 5000;
  public activeSlide = 1;
  public slidesCount = 2;
  public interval: any;

  constructor() { }

  ngOnInit() {
    this.setInterval();
  }

  public setInterval(): void {
    this.interval = setInterval(
        () => {
          this.changeSlide(false);
        },
        this.defaultSliderAutoPLaySpeed
    );
  }

  public changeSlide(manually: boolean): void {
    if (manually === true) {
      clearInterval(this.interval);
    }

    this.activeSlide += 1;

    if (this.activeSlide > this.slidesCount) {
      this.activeSlide = 1;
    }
  }

  public clearInterval(): void {
    clearInterval(this.interval);
  }
}
