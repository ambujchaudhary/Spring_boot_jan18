import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyChatComponent } from './empty-chat.component';

describe('EmptyChatComponent', () => {
  let component: EmptyChatComponent;
  let fixture: ComponentFixture<EmptyChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
