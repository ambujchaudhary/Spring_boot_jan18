import { UserOnlyDirective } from './user-only.directive';
import { User, UserRole, UserStatus } from '../auth/auth.model';
import { Observable } from 'rxjs/Rx';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service';

@Component({
  template: `
    <div><span *zuUserOnly>false</span></div>`,
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
            role: UserRole.ANONYMOUS,
            status: UserStatus.ENABLED,
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
class TestUserOnlyComponent {
  constructor() {
  }
}

describe('UserOnlyDirective', () => {
  let component: TestUserOnlyComponent;
  let fixture: ComponentFixture<TestUserOnlyComponent>;
  let divEl: DebugElement;
  let spanEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestUserOnlyComponent, UserOnlyDirective],
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
                role: UserRole.ANONYMOUS,
                status: UserStatus.ENABLED,
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

    fixture = TestBed.createComponent(TestUserOnlyComponent);
    component = fixture.componentInstance;
    divEl = fixture.debugElement.query(By.css('div'));
    spanEl = fixture.debugElement.query(By.css('span'));
  });

  it('should be empty after init if user role is USER', () => {
    expect(divEl.nativeElement.textContent.trim()).toBe('');
  });
});
