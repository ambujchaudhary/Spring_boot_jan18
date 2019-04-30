import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MaterialComponents } from '../../utils/zu-material-components.module';

import { SharedModule } from '../../shared/shared.module';
import { User, UserRole, UserStatus } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let originalTimeout;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialComponents, SharedModule],
      declarations: [LoginComponent],
      providers: [
        {
          provide: AuthService, useValue: {
            getUser() {
              const mockUser: User = {
                id: '1',
                email: 'string@st.ring',
                firstName: 'firstName',
                lastName: 'lastName',
                role: UserRole.USER,
                status: UserStatus.VERIFICATION_SUCCESS,
                address: 'address',
                social: false
              };

              return Observable.of(mockUser);
            },
          },
        },
        {provide: Router, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

  }));

  afterEach(() => {
    fixture.destroy();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
