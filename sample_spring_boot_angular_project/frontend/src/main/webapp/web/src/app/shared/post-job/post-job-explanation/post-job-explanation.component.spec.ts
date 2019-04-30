import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobExplanationComponent } from './post-job-explanation.component';

describe('PostJobExplanationComponent', () => {
  let component: PostJobExplanationComponent;
  let fixture: ComponentFixture<PostJobExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobExplanationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
