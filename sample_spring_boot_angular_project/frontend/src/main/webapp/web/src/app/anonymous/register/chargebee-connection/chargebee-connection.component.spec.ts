import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargebeeConnectionComponent } from './chargebee-connection.component';

describe('ChargebeeConnectionComponent', () => {
  let component: ChargebeeConnectionComponent;
  let fixture: ComponentFixture<ChargebeeConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargebeeConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargebeeConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
