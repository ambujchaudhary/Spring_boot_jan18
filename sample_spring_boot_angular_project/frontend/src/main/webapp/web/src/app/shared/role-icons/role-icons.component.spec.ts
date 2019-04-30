import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleIconsComponent } from './role-icons.component';

describe('RoleIconsComponent', () => {
  let component: RoleIconsComponent;
  let fixture: ComponentFixture<RoleIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
