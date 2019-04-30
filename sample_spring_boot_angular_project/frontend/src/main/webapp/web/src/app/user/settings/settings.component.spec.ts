import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { UserService } from '../user.service';
import { Observable } from 'rxjs/Rx';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            cancelSubscriptions() {
              return Observable.of(true);
            },
          },
        },
        {
          provide: ToasterConfigService,
          useValue: {
            success(value: string) {
              return true;
            },
            error(value: string) {
              return 'error';
            },
          },
        },
        {
          provide: CallbackHandlerService,
          useValue: {
            getErrorMessage(getErrorMessage: any) {
              return 'error';
            },
          },
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
