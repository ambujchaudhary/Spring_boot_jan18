import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injector, Input, NgZone, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { ChargbeeSubscriptionData, MembershipTypeEnum } from '../../anonymous/anonymous.model';
import { AnonymousService } from '../../anonymous/anonymous.service';
import { ChargebeeUtilsService } from '../../utils/chargebee-utils.service';
import { MathService } from '../../utils/math.service';
import { MessagesService } from '../../utils/messages.service';
import { BuyMembershipModalComponent } from '../job-view-controls/buy-membership-modal/buy-membership-modal.component';

import { JobService } from '../../user/job/job.service';
import { BusinessAndPersonalNames } from '../../auth/auth.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location, UploadedFile, UploadedFileSaveOptions, UploadFileResponse } from '../../user/user.model';
import { MatCheckboxChange, MatDialog } from '@angular/material';
import { Job, JobTypeEnum, NewJobResponse, OwnerNameEnum, OwnershipTypeEnum, PurchaseMembershipModalData } from '../../user/job/job.model';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { ValidationService } from '../../utils/validation.service';
import { GoogleAutocompleteResult } from '../google-autocomplete/google-autocomplete.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as _moment from 'moment';
import { Platform } from '@ionic/angular';

const moment = _moment;
const MAX_COUNT_OF_FILES = 5;
const MAX_FILE_SIZE = 1;

@Component({
  selector: 'zu-post-job',
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss'],
})
export class PostJobComponent implements OnInit {

  @Input() jobEdit: Job;

  private jobId = this.route.snapshot.params['id'];
  public readonly MAX_COUNT_OF_FILES = MAX_COUNT_OF_FILES;
  public readonly MAX_FILE_SIZE = MAX_FILE_SIZE;
  public readonly JobTypeEnum = JobTypeEnum;
  public readonly OwnerNameEnum = OwnerNameEnum;
  public readonly membershipTypeEnum = MembershipTypeEnum;
  public readonly ownershipTypeEnum = OwnershipTypeEnum;

  public acceptsOfFile = '.jpg,.jpeg,.xls,.xlsx,.pdf,.doc,.docx,.JPG,.JPEG,.XLS,.XLSX,.PDF,.DOC,.DOCX';

  public postJobForm: FormGroup;
  public profileNames: BusinessAndPersonalNames;
  public job: Job;
  public uploadedFiles: UploadedFile[];

  public minDate = moment().add(1, 'day');
  public isJobExist: boolean;
  public isJobReady = false;
  public isTermsNotAccepted = true;
  public isRequestInProgress = false;
  public isSpinnerVisible = false;

  public activeStep: number;
  public minBriefWords = 50;
  public maxBriefLength = 5000;

  public isDropZone: boolean;

  private platform: Platform;

  public cbInstance;
  private prefix = '/api/protected';
  private subscriptionId: ChargbeeSubscriptionData;

  private static getDefaultFileList(): UploadedFile[] {
    const filesArray: UploadedFile[] = [];
    for (let i = 0; i < 1; i++) {
      filesArray.push(new UploadedFile());
    }

    return JSON.parse(JSON.stringify(filesArray));
  }

  constructor(
      private jobService: JobService,
      private toaster: ToasterConfigService,
      private callbackService: CallbackHandlerService,
      private validationService: ValidationService,
      private mathService: MathService,
      private messagesService: MessagesService,
      private route: ActivatedRoute,
      private router: Router,
      private injector: Injector,
      private dialog: MatDialog,
      private chargebeeService: ChargebeeUtilsService,
      private zone: NgZone,
      private httpClient: HttpClient,
      private anonymousService: AnonymousService,
      private adminService: AdminService
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  ngOnInit() {
    this.activeStep = 0;

    this.job = new Job();
    this.job.location = new Location();

    if (this.jobEdit && this.jobEdit.ownershipType === this.ownershipTypeEnum.ADMIN) {

      // Data for edit job by admin
      this.job = this.jobEdit;
      this.getBusinessAndPersonalNamesForAdmin();

    } else {
      this.getBusinessAndPersonalNames();
    }

    this.initJobFrom();
    this.uploadedFiles = PostJobComponent.getDefaultFileList();

    this.route.data.subscribe((data: {job: Job}) => {
      this.getExistingJob(data.job);
    });

    try {
      if (this.platform.is('mobile')) {
        this.isDropZone = false;
      } else {
        this.isDropZone = true;
      }
    } catch (e) {
      this.isDropZone = true;
    }

    this.cbInstance = this.chargebeeService.connectToChargebee();
    this.subscriptionId = new ChargbeeSubscriptionData();
  }

  private getBusinessAndPersonalNames(): void {
    this.jobService.getNames()
    .finally(() => {
      this.job.ownerType = OwnerNameEnum.PERSONAL_NAME;
    })
    .subscribe(
        (data: BusinessAndPersonalNames) => {
          this.profileNames = data;
        },
        (error: BusinessAndPersonalNames) => {
          this.profileNames = {businessName: 'BUSINESS_NAME', personalName: 'PERSONAL_NAME'};
        });
  }

  private getBusinessAndPersonalNamesForAdmin(): void {
    const ownerId = parseInt(this.job.ownerId, 10);

    this.adminService.getNames(ownerId)
    .subscribe(
        (data: BusinessAndPersonalNames) => {
          this.profileNames = data;
        },
        () => {
          this.profileNames = {businessName: 'BUSINESS_NAME', personalName: 'PERSONAL_NAME'};
        });
  }

  private initJobFrom(): void {
    this.postJobForm = new FormGroup({
      title: new FormControl('', Validators.required),
      brief: new FormControl(''),
      location: new FormControl('', Validators.required),
      owner: new FormControl('', Validators.required),
    });
  }

  private getExistingJob(data: Job) {
    if (typeof this.jobId === 'undefined') {

      this.job.numberOfHour = '1';
      this.job.pricePerHour = '0';

      this.isJobReady = true;
      return;
    }

    this.isJobExist = true;

    if (data) {
      this.isJobReady = true;
      this.job = data;
      this.postJobForm.get('location').setValue(this.job.location.address);

      // cut zero decimals
      const tmpPricePerHour = parseFloat(this.job.pricePerHour).toString();
      const tmpNumberOfHour = parseFloat(this.job.numberOfHour).toString();

      this.setJobPricePerHour(tmpPricePerHour);
      this.setJobNumberOfHour(tmpNumberOfHour);

      const tmpUploadedFiles = Array.prototype.map.call(this.job.attachment, (file) => {
        const tmpFile = Object.assign({}, file);
        UploadedFile.setClientSideData(tmpFile);

        return tmpFile;
      });
      this.uploadedFiles = tmpUploadedFiles as UploadedFile[];
    }
  }

  private getFileByIndex(index: number): UploadedFile {
    return this.uploadedFiles[index] || new UploadedFile();
  }

  private validationBeforeSend(): boolean {
    let isValid = false;

    const jobDataValue = {
      title: this.postJobForm.get('title').value,
      brief: this.postJobForm.get('brief').value,
      ownerType: this.postJobForm.get('owner').value,
      date: this.job.date,
      pricePerHour: this.job.pricePerHour,
    };

    if (this.validationService.isStringNotEmpty(jobDataValue.ownerType) === false) {
      this.messagesService.showError('post_job.enter_the_job_owner.message_error');
    } else if (this.validationService.isStringNotEmpty(jobDataValue.title) === false) {
      this.messagesService.showError('post_job.enter_the_job_title.message_error');
    } else if (this.validationService.isStringNotEmpty(jobDataValue.brief) === false ||
               this.validationService.isWordsLessThan(jobDataValue.brief, 50)) {
      this.messagesService.showError('post_job.job_brief_should_contain_50_word.message_error');
    } else if (this.isValidAutocompleteLocation(this.job.location) === false) {
      this.messagesService.showError('post_job.enter_the_job_location.message_error');
    } else if (this.validationService.isStringNotEmpty(jobDataValue.date) === false) {
      this.messagesService.showError('post_job.enter_job_date.message_error');
    } else if (jobDataValue.pricePerHour === '0') {
      this.messagesService.showError('post_job.price_can_not_be_0.message_error');
    } else if (this.validationService.isArrayNotEmpty(this.job.workerRoles) === false) {
      this.messagesService.showError('post_job.select_job_type.message_error');
    } else if (this.isFileLoading() === true) {
      this.messagesService.showError('post_job.file_is_loading.message_error');
    } else {
      isValid = true;
    }

    return isValid;
  }

  private isValidAutocompleteLocation(location: Location): boolean {
    let result = true;

    const {address, lng, lat} = location;

    const isTextFieldEmpty = this.validationService.isStringNotEmpty(address);
    if (isTextFieldEmpty === false || typeof lat === 'undefined' || typeof lng === 'undefined') {
      result = false;
    }

    return result;
  }

  private fillData() {
    this.job.title = this.postJobForm.get('title').value;
    this.job.brief = this.postJobForm.get('brief').value;
    this.job.ownerType = this.postJobForm.get('owner').value;
    this.job.attachment = this.uploadedFiles.reduce(
        (newArr, file) => {
          if (typeof file.url === 'string' && file.url.trim().length > 0 && file.isInvalid === false && file.isLoading === false) {
            return [...newArr, file.url];
          } else {
            return newArr;
          }
        },
        []
    );
  }

  private uploadFileOnServer(element: HTMLInputElement, targetFile: UploadedFile) {

    const saveOptions: UploadedFileSaveOptions = this.getOptionsForUploadFileOnServer();

    const files: FileList = element.files;

    if (typeof files === 'object' && files.length === 0) {
      return false;
    }

    // get only first item
    const file: File = files[0];

    UploadedFile.setClientSideData(targetFile);
    targetFile.originalName = file.name;
    targetFile.isLoading = true;

    if (this.validationService.isAcceptedFileExtension(file.name, saveOptions.acceptedExtension) === false) {
      UploadedFile.addError(targetFile, saveOptions.extensionErrorMessage);
      this.toaster.error(targetFile.errorMessage);
      return false;
    }

    if (this.validationService.isFileSizeLessMb(file, this.MAX_FILE_SIZE) === false) {
      UploadedFile.addError(targetFile, saveOptions.sizeErrorMessage);
      this.toaster.error(targetFile.errorMessage);
      return false;
    }

    this.jobService.uploadFile(file)
    .finally(() => {
      targetFile.isLoading = false;

      // Delete origin file from DOM input element.
      // User will able upload the same file one more time
      element.value = '';
    })
    .subscribe(
        (data: UploadFileResponse) => {
          targetFile.originalName = data.originalName;
          targetFile.url = data.url;
          targetFile.fullName = data.fullName;
          targetFile.isInvalid = false;
        },
        (errorData: any) => {
          const serverErrorMessage = this.callbackService.getErrorMessage(errorData);

          UploadedFile.addError(targetFile, serverErrorMessage);
          this.toaster.error(serverErrorMessage);
        });
  }

  private getOptionsForUploadFileOnServer(): UploadedFileSaveOptions {
    const options = new UploadedFileSaveOptions();
    options.acceptedExtension = this.acceptsOfFile;
    options.extensionErrorMessage = `Only ${options.acceptedExtension} accepted`;
    options.sizeErrorMessage = `File size should be less than ${this.MAX_FILE_SIZE}Mb`;
    return options;
  }

  private deleteUploadedFile(targetFile: UploadedFile, index: number): void {
    UploadedFile.resetData(targetFile);

    if (this.uploadedFiles.length === 1) {
      Array.prototype.splice.call(this.uploadedFiles, index, 1, new UploadedFile());
    } else {
      Array.prototype.splice.call(this.uploadedFiles, index, 1);
    }
  }

  private openExtendMembershipModal(): void {
    this.isRequestInProgress = true;

    const modalData = new PurchaseMembershipModalData(
        'Upgrade your membership',
        'Oh no! Your free membership has hit its limit. Upgrade your' +
        ' Zu membership to be able to apply and post Jobs. You can stay on the Free tier if you just want to browse.');

    const dialogRef = this.dialog.open(BuyMembershipModalComponent, {
      panelClass: ['purchase-membership-modal', 'public-page-backgroud'],
      data: modalData
    });

    dialogRef.afterClosed().subscribe(
        (result: MembershipTypeEnum) => {
          switch (result) {
            case this.membershipTypeEnum.MONTHLY:
              this.openCheckout(this.membershipTypeEnum.MONTHLY);
              break;
            case this.membershipTypeEnum.ANNUAL:
              this.openCheckout(this.membershipTypeEnum.ANNUAL);
              break;
            default:
              this.toaster.error('You should subscribe new membership to post a job!');
              this.isRequestInProgress = false;
          }
        }
    );
  }

  private SendHostedId(): void {
    if (this.subscriptionId.hostedPageId !== '') {
      this.anonymousService.createChargebeeSubscription(this.subscriptionId)
      .finally(
          () => {
            this.isRequestInProgress = false;
          }
      )
      .subscribe(
          () => {
            this.toaster.success('Subscription created!');
            this.postJob();
          },
          () => {
            this.messagesService.showError('common.message_error');
          }
      );
    } else {
      this.toaster.error('You should subscribe new membership to post a job!');
      this.isRequestInProgress = false;
    }
  }

  private openCheckout(id: MembershipTypeEnum): void {

    this.cbInstance.logout();
    this.cbInstance.openCheckout({
      hostedPage: () => {
        return this.httpClient.post(
            `${this.prefix}/subscriptions/checkout`,
            this.chargebeeService.getFormUrlEncoded({plan_id: id}),
            {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})}
        ).toPromise();
      },
      loaded: () => {},
      close: () => {
        this.zone.run(() => {
          this.SendHostedId();
        });
      },
      success: (hostedPageId) => {
        this.zone.run(() => {
          this.subscriptionId.hostedPageId = hostedPageId;
        });
      }
    });
  }

  public getAddress(data: GoogleAutocompleteResult): void {
    this.job.location = {
      address: data.input,
      lng: data.place.geometry.location.lng(),
      lat: data.place.geometry.location.lat(),
    };
  }

  // TODO
  public uploadFile(event: {target: HTMLInputElement}, index: number): void {
    const target: HTMLInputElement = event.target;
    const targetFile = this.getFileByIndex(index);

    this.uploadFileOnServer(target, targetFile);
  }

  public addUploadedFiles(): void {
    if (this.uploadedFiles.length < MAX_COUNT_OF_FILES) {
      this.uploadedFiles = [...this.uploadedFiles, new UploadedFile()];
    }
  }

  public toggleType(role: JobTypeEnum, event: MatCheckboxChange): void {
    if (event.checked === true) {
      this.job.workerRoles = [...this.job.workerRoles, role];
    } else {
      this.job.workerRoles = this.job.workerRoles.filter((roleItem) => roleItem !== role);
    }
  }

  public acceptTerms(event: MatCheckboxChange): void {
    if (event.checked === true) {
      this.isTermsNotAccepted = false;
    } else {
      this.isTermsNotAccepted = true;
    }
  }

  public postJob(): void {
    this.fillData();
    const methodAPI = this.isJobExist === true ? 'updateJob' : 'postJob';
    this.isRequestInProgress = true;
    this.isSpinnerVisible = true;

    if (this.job.ownershipType === this.ownershipTypeEnum.ADMIN) {
      this.adminService.editJob(this.job, this.jobId)
      .finally(
          () => {
            this.isSpinnerVisible = false;
          }
      )
      .subscribe(
          () => {
            this.messagesService.showSuccess('post_job.job_has_been_edited.message_success');
            this.router.navigate(['/job-management', this.jobId, 'view'], {queryParams: {relative: 'true'}});
          },
          (error) => {
            this.toaster.error(this.callbackService.getErrorMessage(error));
            this.isRequestInProgress = false;
          });
    }

    if (methodAPI === 'postJob' && this.job.ownershipType !== this.ownershipTypeEnum.ADMIN) {
      this.jobService[methodAPI](this.job)
      .finally(
          () => {
            this.isSpinnerVisible = false;
          }
      )
      .subscribe(
          (data: NewJobResponse) => {
            this.messagesService.showSuccess('post_job.job_has_been_posted.message_success');
            this.router.navigate(['/job', data.id, 'view'], {queryParams: {relative: 'true'}});
          },
          (error) => {
            if (error.status === 403 && this.isMobile() === false) {
              this.openExtendMembershipModal();
            } else if (error.status === 403 && this.isMobile() === true) {
              this.toaster.error('You should subscribe new membership on WEB app.');
            } else {
              this.toaster.error(this.callbackService.getErrorMessage(error));
              this.isRequestInProgress = false;
            }
          });
    }

    if (methodAPI === 'updateJob' && this.job.ownershipType !== this.ownershipTypeEnum.ADMIN) {
      this.jobService[methodAPI](this.job, this.jobId)
      .finally(
          () => {
            this.isSpinnerVisible = false;
          }
      )
      .subscribe(
          () => {
            this.messagesService.showSuccess('post_job.job_has_been_edited.message_success');
            this.router.navigate(['/job', this.jobId, 'view'], {queryParams: {relative: 'true'}});
          },
          (error) => {
            this.toaster.error(this.callbackService.getErrorMessage(error));
            this.isRequestInProgress = false;
          });
    }
  }

  public setJobDate(value: string): void {
    this.job.date = value;
  }

  public setJobPricePerHour(value: string): void {
    this.job.pricePerHour = value;
  }

  public setJobNumberOfHour(value: string): void {
    this.job.numberOfHour = value;
  }

  public calcTotalAmount(): number {
    let totalAmount: number;
    const defaultTotal = 0;

    const {pricePerHour, numberOfHour} = this.job;
    const isPrice = this.validationService.isStringNotEmpty(pricePerHour);
    const isNumber = this.validationService.isStringNotEmpty(numberOfHour);

    if (isPrice === false || isNumber === false) {
      return defaultTotal;
    }

    const price = parseFloat(pricePerHour);
    const number = parseFloat(numberOfHour);

    totalAmount = this.mathService.multiplyTwoDecimals(price, number);

    if (totalAmount !== totalAmount) {
      return defaultTotal;
    }

    return totalAmount;
  }

  public setJobEquipment(newEquipment: string[]): void {
    this.job.equipment = [...newEquipment];
  }

  public deleteFile(index: number): void {
    const targetFile = this.getFileByIndex(index);

    if (this.validationService.isStringNotEmpty(targetFile.fullName) === false) {
      this.deleteUploadedFile(targetFile, index);
      return;
    }

    targetFile.isLoading = true;

    this.jobService.deleteFile(targetFile.fullName)
    .finally(() => targetFile.isLoading = false)
    .subscribe(
        (data: UploadFileResponse) => {
          this.deleteUploadedFile(targetFile, index);
        },
        (errorData: any) => {
          this.toaster.error(this.callbackService.getErrorMessage(errorData));
        });
  }

  public isSelectedType(type: JobTypeEnum): boolean {
    return (this.job.workerRoles || []).some((item) => item === type);
  }

  public backToEdit(): void {
    this.activeStep = 0;
    this.hookAfterChangeStep();
    this.isTermsNotAccepted = true;
  }

  public goToPreview(): void {
    const isValid = this.validationBeforeSend();

    if (isValid === true) {
      this.activeStep = 1;
      this.hookAfterChangeStep();
    }
  }

  private hookAfterChangeStep(): void {
    window.scrollTo(0, 0);
  }

  public isNumberOfHour(): boolean {
    return typeof this.job.numberOfHour === 'string';
  }

  public isPricePerHour(): boolean {
    return typeof this.job.pricePerHour === 'string';
  }

  public isFileLoading(): boolean {
    for (let i = 0; i < this.uploadedFiles.length; i++) {
      if (this.uploadedFiles[i].isLoading === true) {
        return true;
      }
    }
  }

  public setHeaderTitle(): string {
    if (this.activeStep === 0 && typeof this.jobId === 'undefined') {
      return 'POST A JOB';
    }
    if (this.activeStep === 1) {
      return 'CONFIRMATION REQUIRED';
    }
    if (this.activeStep === 0 && typeof this.jobId !== 'undefined') {
      return 'EDIT JOB POST';
    }
  }

  public setHeaderBackground(): number {
    if (this.activeStep === 0 && typeof this.jobId === 'undefined') {
      return 2;
    }
    if (this.activeStep === 1) {
      return 4;
    }
    if (this.activeStep === 0 && typeof this.jobId !== 'undefined') {
      return 2;
    }
  }

  public setHeaderText(): string {
    if (this.activeStep === 0 && typeof this.jobId === 'undefined') {
      return 'Find professional crew in your job area';
    } else {
      return '';
    }
  }

  public getBriefWordsCount(): number {
    if (typeof this.job.brief !== 'undefined') {
      return this.job.brief.split(' ').filter((n) => {
        return n !== '';
      }).length;
    }
  }

  public getBriefCounterStyle(): string {
    if (typeof this.job.brief !== 'undefined') {
      if (this.validationService.isWordsLessThan(this.job.brief, 50) === false) {
        return 'green';
      } else {
        return 'red';
      }
    }
  }

  public isMobile(): boolean {
    try {
      if (this.platform.is('mobile')) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  public openTermsOfUse(link: string): void {
    window.open(link, '_system', 'location=no');
  }
}
