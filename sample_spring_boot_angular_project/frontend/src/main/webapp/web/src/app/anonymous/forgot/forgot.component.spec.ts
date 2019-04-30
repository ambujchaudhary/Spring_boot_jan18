import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../auth/auth.service';

import { ForgotComponent } from './forgot.component';

describe('ForgotComponent', () => {
  let component: ForgotComponent;
  let fixture: ComponentFixture<ForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialComponents, SharedModule],
      declarations: [ForgotComponent],
      providers: [
        {provide: AuthService, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ForgotComponent);
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