import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User, UserRole, UserStatus } from '../../../auth/auth.model';
import { AuthService } from '../../../auth/auth.service';
import { MaterialComponents } from '../../../utils/zu-material-components.module';
import { SharedModule } from '../../../shared/shared.module';

import { UserProfilePendingComponent } from './user-profile-pending.component';

describe('UserProfilePendingComponent', () => {
  let component: UserProfilePendingComponent;
  let fixture: ComponentFixture<UserProfilePendingComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MaterialComponents, SharedModule],
      declarations: [UserProfilePendingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthService, useValue: {
            getUser() {
              const mockUser: User = {
                id: '1',
                email: 'string',
                firstName: 'string',
                lastName: 'string',
                role: UserRole.USER,
                status: UserStatus.ENABLED,
              };

              return Observable.of(mockUser);
            },
          },
        },
        {provide: Router, useValue: {}}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
