import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PostJobControlsComponent } from './post-job-controls.component';

describe('PostJobControlsComponent', () => {
  let component: PostJobControlsComponent;
  let fixture: ComponentFixture<PostJobControlsComponent>;
  let divEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostJobControlsComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobControlsComponent);
    component = fixture.componentInstance;
    divEl = fixture.debugElement.query(By.css('div'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set step equal 0 or 1', () => {
    component.step = undefined;
    fixture.detectChanges();
    expect(divEl.children.length).toBe(0);

    component.step = null;
    fixture.detectChanges();
    expect(divEl.children.length).toBe(0);

    component.step = 0;
    fixture.detectChanges();
    expect(divEl.children.length).toBe(1);

    component.step = 1;
    fixture.detectChanges();
    expect(divEl.children.length).toBe(2);
  });

  it('click button "Continue" should emit event', () => {
    let event: null | undefined;

    event = null;
    component.step = 0;
    fixture.detectChanges();

    // Subscribe to the Observable and store the user in a local variable.
    component.onNext.subscribe((value) => event = value);

    // This sync emits the event and the subscribe callback gets executed above
    divEl.children[0].triggerEventHandler('click', null);
    expect(event).toBeUndefined();
  });

  it('click button "Back" should emit event', () => {
    let event: null | undefined;

    event = null;
    component.step = 1;
    fixture.detectChanges();

    // Subscribe to the Observable and store the user in a local variable.
    component.onBack.subscribe((value) => event = value);

    // This sync emits the event and the subscribe callback gets executed above
    divEl.children[0].triggerEventHandler('click', null);
    expect(event).toBeUndefined();
  });

  it('click button "Post a Job" should emit event', () => {
    let event: null | undefined;

    event = null;
    component.step = 1;
    fixture.detectChanges();

    // Subscribe to the Observable and store the user in a local variable.
    component.onSubmit.subscribe((value) => event = value);

    // This sync emits the event and the subscribe callback gets executed above
    divEl.children[1].triggerEventHandler('click', null);
    expect(event).toBeUndefined();
  });

});
