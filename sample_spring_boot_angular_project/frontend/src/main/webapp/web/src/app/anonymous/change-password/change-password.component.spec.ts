import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MaterialComponents } from '../../utils/zu-material-components.module';

import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../auth/auth.service';
import { ChangePasswordComponent } from './change-password.component';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialComponents, SharedModule],
      declarations: [ChangePasswordComponent],
      providers: [
        {provide: AuthService, useValue: {}},
        {provide: ActivatedRoute, useValue: {params: Observable.of('test')}},
        {provide: Router, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ChangePasswordComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
