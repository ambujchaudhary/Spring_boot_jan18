import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { of } from 'rxjs/internal/observable/of';
import { SharedModule } from '../../shared/shared.module';
import { SharedUserModule } from '../../user/shared-user/shared-user.module';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { AdminUserManagementInfo } from '../admin.model';
import { AdminService } from '../admin.service';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MaterialComponents,
        ReactiveFormsModule,
        SharedModule,
        SharedUserModule,
        TextMaskModule
      ],
      declarations: [DashboardComponent],
      providers: [
        {
          provide: AdminService, useValue: {
            getUsers: of({} as AdminUserManagementInfo)
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
