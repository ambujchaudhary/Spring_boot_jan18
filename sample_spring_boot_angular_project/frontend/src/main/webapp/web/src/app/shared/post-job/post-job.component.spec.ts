import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { SharedModule } from '../shared.module';
import { JobService } from '../../user/job/job.service';

import { PostJobComponent } from './post-job.component';
import 'rxjs-compat/add/observable/of';

describe('./src/main/webapp/src/app/user/job/post-job/PostJobComponent', () => {
  let component: PostJobComponent;
  let fixture: ComponentFixture<PostJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, MaterialComponents, RouterTestingModule, SharedModule],
      declarations: [PostJobComponent],
      providers: [
        {
          provide: JobService, useValue: {
            getNames() {
              return Observable.of({businessName: 'businessName', personalName: 'personalName'});
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {path: '/job', params: Observable.of({id: 1}), snapshot: {params: {id: 1}}},
        },
        {provide: Router, useValue: {}}
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
