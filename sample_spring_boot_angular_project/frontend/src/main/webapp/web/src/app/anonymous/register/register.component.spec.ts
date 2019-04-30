import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MaterialComponents } from '../../utils/zu-material-components.module';

import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../auth/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialComponents, SharedModule],
      declarations: [RegisterComponent],
      providers: [
        {provide: AuthService, useValue: {}},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 1}}, paramMap: Observable.of({get: () => 1})}}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(RegisterComponent);
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