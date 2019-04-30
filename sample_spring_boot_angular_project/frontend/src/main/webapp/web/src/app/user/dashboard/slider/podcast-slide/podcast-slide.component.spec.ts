import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastSlideComponent } from './podcast-slide.component';

describe('PodcastSlideComponent', () => {
  let component: PodcastSlideComponent;
  let fixture: ComponentFixture<PodcastSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodcastSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
