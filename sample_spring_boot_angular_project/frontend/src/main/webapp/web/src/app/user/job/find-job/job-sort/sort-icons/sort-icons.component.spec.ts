import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortIconsComponent } from './sort-icons.component';

describe('SortIconsComponent', () => {
  let component: SortIconsComponent;
  let fixture: ComponentFixture<SortIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
