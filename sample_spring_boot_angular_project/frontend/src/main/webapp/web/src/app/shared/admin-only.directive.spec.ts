import { Component, DebugElement, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AdminOnlyDirective } from './admin-only.directive';
import { AuthService } from '../auth/auth.service';
import { User, UserRole, UserStatus } from '../auth/auth.model';

@Component({
  template: `
    <div><span *zuAdminOnly>false</span></div>`,
  providers: [
    {
      provide: AuthService,
      useValue: {
        getUser() {
          const mockUser: User = {
            id: '1',
            email: 'email@ema.il',
            firstName: 'string',
            lastName: 'string',
            role: UserRole.ADMIN,
            status: UserStatus.ENABLED,
            address: 'address',
            social: false
          };

          return Observable.of(mockUser);
        },
      },
    },
    {
      provide: TemplateRef, useValue: {},
    },
    {
      provide: ViewContainerRef, useValue: {},
    }
  ]
})
class TestAdminOnlyComponent {
  constructor() {
  }
}

describe('AdminOnlyDirective', () => {

  let component: TestAdminOnlyComponent;
  let fixture: ComponentFixture<TestAdminOnlyComponent>;
  let divEl: DebugElement;
  let spanEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAdminOnlyComponent, AdminOnlyDirective],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUser() {
              const mockUser: User = {
                id: '1',
                email: 'string',
                firstName: 'string',
                lastName: 'string',
                role: UserRole.ADMIN,
                status: UserStatus.ENABLED,
                address: 'ad',
                social: false
              };

              return Observable.of(mockUser);
            },
          },
        },
        {
          provide: TemplateRef, useValue: {},
        },
        {
          provide: ViewContainerRef, useValue: {},
        }
      ]
    });

    fixture = TestBed.createComponent(TestAdminOnlyComponent);
    component = fixture.componentInstance;
    divEl = fixture.debugElement.query(By.css('div'));
    spanEl = fixture.debugElement.query(By.css('span'));
  });

  it('should be empty after init if user role is ADMIN', () => {
    expect(divEl.nativeElement.textContent.trim()).toBe('');
  });

  it('should remove content if user role is ADMIN', () => {
    expect(spanEl).toBeNull();
  });
});
