import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BusinessAndPersonalNames } from '../../auth/auth.model';
import { AccordionComponent } from '../accordion/accordion.component';
import { AttachmentsPreviewComponent } from '../attachments-preview/attachments-preview.component';
import { SummaryComponent } from '../summary/summary.component';
import { EquipmentsPreviewComponent } from '../equipments-preview/equipments-preview.component';
import { Location, UploadedFile } from '../../user/user.model';
import { JobApplicants, JobStatusEnum, OwnerNameEnum, OwnershipTypeEnum } from '../../user/job/job.model';
import { PostJobExplanationComponent } from '../post-job/post-job-explanation/post-job-explanation.component';

import { JobPreviewComponent } from './job-preview.component';

const mockOwnerName: BusinessAndPersonalNames = {
  businessName: 'Business Name',
  personalName: 'Personal Name',
};

const jobMock = {
  allFields: {
    ownerType: OwnerNameEnum.PERSONAL_NAME,
    title: 'string',
    date: '2020-01-01',
    location: {
      address: 'string',
      lng: 0,
      lat: 0,
    },
    brief: 'string',
    pricePerHour: '1',
    numberOfHour: '1',
    attachment: [new UploadedFile()],
    jobStatus: JobStatusEnum.NEW,
    ownerName: 'string',
    workerRoles: [],
    equipment: [],
    lastAction: '2018-01-01'
  },
  ownerUndefined: {
    ownerType: undefined,
  },
  ownerNull: {
    ownerType: null,
  },
  ownerBusinessName: {
    ownerType: OwnerNameEnum.BUSINESS_NAME,
  },
  personalName: {
    ownerType: OwnerNameEnum.PERSONAL_NAME,
  },
};

const mockAttachments = {
  emptyList: [],
  oneInvalidItem: [{
    fullName: 'testFullName',
    originalName: 'testOriginalName',
    url: 'testUrl',
    errorMessage: 'testErrorMessage',
    isInvalid: true,
    isLoading: false,
  }],
  oneItem: [{
    fullName: 'testFullName',
    originalName: 'testOriginalName',
    url: 'testUrl',
    errorMessage: 'testErrorMessage',
    isInvalid: false,
    isLoading: false,
  }],
  valiadAndInvalid: [{
    fullName: 'testFullName',
    originalName: 'testOriginalName',
    url: 'testUrl',
    errorMessage: 'testErrorMessage',
    isInvalid: false,
    isLoading: false,
  }, {
    fullName: 'testFullName',
    originalName: 'testOriginalName',
    url: 'testUrl',
    errorMessage: 'testErrorMessage',
    isInvalid: true,
    isLoading: false,
  }],
};

describe('JobPreviewComponent', () => {
  let component: JobPreviewComponent;
  let fixture: ComponentFixture<JobPreviewComponent>;
  let containerEl: DebugElement;
  let ownerEl: DebugElement;
  let attachmentsContainerEl: DebugElement;
  let amountEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobPreviewComponent,
                     AccordionComponent,
                     AttachmentsPreviewComponent,
                     EquipmentsPreviewComponent,
                     PostJobExplanationComponent,
                     SummaryComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPreviewComponent);
    component = fixture.componentInstance;
    component.job = jobMock.allFields;
    component.profileNames = mockOwnerName;
    component.totalAmount = 1;

    containerEl = fixture.debugElement.queryAll(By.css('.container-summary'))[1];
    attachmentsContainerEl = containerEl.queryAll(By.css('div'))[2];
    ownerEl = fixture.debugElement.query(By.css('zu-summary'));
    amountEl = fixture.debugElement.query(By.css('.currency-amount'));

    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show owner name', () => {
    component.job = Object.assign({}, jobMock.allFields, jobMock.ownerUndefined);
    fixture.detectChanges();
    expect(ownerEl.nativeElement.textContent.trim()).toContain(mockOwnerName.personalName);

    component.job = Object.assign({}, jobMock.allFields, jobMock.ownerNull);
    fixture.detectChanges();
    expect(ownerEl.nativeElement.textContent.trim()).toContain(mockOwnerName.personalName);

    component.job = Object.assign({}, jobMock.allFields, jobMock.ownerBusinessName);
    component.profileNames = Object.assign({}, mockOwnerName);
    fixture.detectChanges();
    expect(ownerEl.nativeElement.textContent.trim()).toContain(mockOwnerName.businessName);

    component.job = Object.assign({}, jobMock.allFields, jobMock.personalName);
    component.profileNames = Object.assign({}, mockOwnerName);
    fixture.detectChanges();
    expect(ownerEl.nativeElement.textContent.trim()).toContain(mockOwnerName.personalName);
    //    expect(ownerEl.nativeElement.textContent.trim()).toBe(mockOwnerName.personalName);

  });

  it('should show total amount', () => {
    component.totalAmount = 1;
    fixture.detectChanges();
    expect(amountEl.nativeElement.textContent.trim()).toBe('$1.00');
  });

  it('should show only uploaded attachments', () => {
    component.attachments = [...mockAttachments.emptyList];
    fixture.detectChanges();
    expect(attachmentsContainerEl.children.length).toBe(2);
    //    expect(attachmentsContainerEl.nativeElement.textContent).not.toContain(mockAttachments.oneItem[0].fullName);

    component.attachments = [...mockAttachments.oneInvalidItem];
    fixture.detectChanges();
    expect(attachmentsContainerEl.children.length).toBe(2);
    //    expect(attachmentsContainerEl.nativeElement.textContent).not.toContain(mockAttachments.oneItem[0].fullName);

    component.attachments = [...mockAttachments.oneItem] as UploadedFile[];
    fixture.detectChanges();
    expect(attachmentsContainerEl).not.toBeNull();
    expect(attachmentsContainerEl.children.length).toBe(2);
    //    expect(attachmentsContainerEl.nativeElement.textContent).toContain(mockAttachments.oneItem[0].fullName);

    component.attachments = [...mockAttachments.valiadAndInvalid] as UploadedFile[];
    fixture.detectChanges();
    expect(attachmentsContainerEl).not.toBeNull();
    expect(attachmentsContainerEl.children.length).toBe(2);
    //    expect(attachmentsContainerEl.nativeElement.textContent).toContain(mockAttachments.oneItem[0].fullName);
  });

});
