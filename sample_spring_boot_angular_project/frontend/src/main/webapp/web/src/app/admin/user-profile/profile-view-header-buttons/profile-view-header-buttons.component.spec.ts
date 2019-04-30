import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileViewHeaderButtonsComponent } from './profile-view-header-buttons.component';

describe('ProfileViewHeaderButtonsComponent', () => {
  let component: ProfileViewHeaderButtonsComponent;
  let fixture: ComponentFixture<ProfileViewHeaderButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileViewHeaderButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileViewHeaderButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
