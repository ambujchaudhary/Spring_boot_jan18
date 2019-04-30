import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipGroupComponent } from './tooltip-group.component';

describe('TooltipGroupComponent', () => {
  let component: TooltipGroupComponent;
  let fixture: ComponentFixture<TooltipGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
