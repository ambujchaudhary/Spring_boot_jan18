import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { IntroHeaderComponent } from './intro-header.component';

describe('IntroHeaderComponent', () => {
  let component: IntroHeaderComponent;
  let fixture: ComponentFixture<IntroHeaderComponent>;

  let mainTitleText: HTMLElement;
  let subTitleText: HTMLElement;
  let descriptionText: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntroHeaderComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render in main title', () => {
    mainTitleText = fixture.debugElement.query(By.css('.intro-header__title')).nativeElement;
    expect(mainTitleText.textContent)
    .toEqual('make your zu membership count!');
  });

  it('should render in sub-title', () => {
    subTitleText = fixture.debugElement.query(By.css('.intro-header__sub-title')).nativeElement;
    expect(subTitleText.textContent)
    .toEqual('Keep your public profile up to date');
  });

  it('should render in description', () => {
    descriptionText = fixture.debugElement.query(By.css('.intro-header__description')).nativeElement;
    expect(descriptionText.textContent)
    .toEqual(
        'Your profile information will be sent to businesses when you apply for a job. Keep adding to your profile and portfolio' +
        ' - be noticed! Your portfolio should showcase the best you have to offer.');
  });
});
