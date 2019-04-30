import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from '../../../../../../node_modules/rxjs/Rx';
import { GoogleAutocompleteResult } from '../../../shared/google-autocomplete/google-autocomplete.model';
import {
  Experience, ExperienceEnum, ExperienceLabelEnum,
  Location,
  UploadedFile,
  UploadedFileSaveOptions,
  UploadedFileServiceMethod,
  UploadedFileType,
  UploadFileResponse,
  WorkerRoleEnum
} from '../../../user/user.model';
import { UserService } from '../../../user/user.service';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { ValidationService } from '../../../utils/validation.service';
import { EditedProfileData, GoogleAutoCompleteTypeEnum, UserProfileForEditData } from '../../admin.model';
import { AdminService } from '../../admin.service';
import { MessagesService } from '../../../utils/messages.service';
import { createNumberMask } from 'text-mask-addons/dist/textMaskAddons';

const MEDIA_URL_REGEX = /^(((http(s))|(Http(s)))?:\/\/)?(m.|player.|www.)?(vimeo\.com|wistia|mediazilla|facebook|youtu(be|.be))?(\.com)?\/.+/;
const URL_REGEX = /^(((http)|(https)|(Http)|(Https))?:\/\/)??[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/;

const MIN_COUNT_OF_UPLOADED_IMAGES = 10;
const MIN_COUNT_OF_VIDEO_URLS = 5;
const MIN_COUNT_OF_ADDITIONAL_LINKS = 1;
const MAX_COUNT_OF_UPLOADED_IMAGES = 20;
const MAX_COUNT_OF_VIDEO_URLS = 10;
const MAX_COUNT_OF_ADDITIONAL_LINKS = 5;

@Component({
  selector: 'zu-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss']
})
export class UserProfileEditComponent implements OnInit {
  public readonly MAX_COUNT_OF_UPLOADED_IMAGES = MAX_COUNT_OF_UPLOADED_IMAGES;
  public readonly MAX_COUNT_OF_VIDEO_URLS = MAX_COUNT_OF_VIDEO_URLS;
  public readonly MAX_COUNT_OF_ADDITIONAL_LINKS = MAX_COUNT_OF_ADDITIONAL_LINKS;
  public readonly MIN_COUNT_OF_VIDEO_URLS = MIN_COUNT_OF_VIDEO_URLS;
  public readonly MIN_COUNT_OF_ADDITIONAL_LINKS = MIN_COUNT_OF_ADDITIONAL_LINKS;

  public readonly WorkerRoleEnum = WorkerRoleEnum;
  public readonly GoogleAutoCompleteTypeEnum = GoogleAutoCompleteTypeEnum;

  private userId = this.route.snapshot.params['id'];
  private editedData: EditedProfileData;

  public userProfileData: UserProfileForEditData;

  public acceptsOfImage = '.jpg,.jpeg,.JPG,.JPEG';
  public acceptsOfCertificate = '.pdf,.jpg,.jpeg,.png,.PDF,.JPG,.JPEG,.PNG';
  public userProfileForm: any;
  public experienceList: Experience[];
  public isRequestInProgress = false;
  public uploadedImages: UploadedFile[];
  public uploadedCertificate = new UploadedFile();

  public mask: any;

  constructor(
      private adminService: AdminService,
      private toaster: ToasterConfigService,
      private route: ActivatedRoute,
      private validationService: ValidationService,
      private callbackService: CallbackHandlerService,
      private userService: UserService,
      private router: Router,
      private messagesService: MessagesService) {}

  private static getDefaultExperience(): Experience[] {
    const _experience: Experience[] = [
      {
        key: ExperienceEnum.BEGINNER,
        label: ExperienceLabelEnum.BEGINNER,
      }, {
        key: ExperienceEnum.INTERMEDIATE,
        label: ExperienceLabelEnum.INTERMEDIATE,
      }, {
        key: ExperienceEnum.SOLID,
        label: ExperienceLabelEnum.SOLID,
      }, {
        key: ExperienceEnum.ADVANCE,
        label: ExperienceLabelEnum.ADVANCE,
      }, {
        key: ExperienceEnum.MASTER,
        label: ExperienceLabelEnum.MASTER,
      }
    ];

    return JSON.parse(JSON.stringify(_experience));
  }

  private static getDefaultImageList(): UploadedFile[] {
    const imagesArray: UploadedFile[] = [];
    for (let i = 0; i < MIN_COUNT_OF_UPLOADED_IMAGES; i++) {
      imagesArray.push(new UploadedFile());
    }

    return JSON.parse(JSON.stringify(imagesArray));
  }

  ngOnInit() {
    this.initUserProfileForm();
    this.userProfileData = new UserProfileForEditData();
    this.editedData = new EditedProfileData();
    this.userProfileData.profilePhoto = new UploadedFile();
    this.userProfileData.profileLocation = new Location();
    this.userProfileData.businessLocation = new Location();
    this.experienceList = UserProfileEditComponent.getDefaultExperience();
    this.uploadedImages = UserProfileEditComponent.getDefaultImageList();
    this.getUserProfileData();

    this.mask = createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: false,
      allowDecimal: false,
      integerLimit: 100,
      requireDecimal: false,
      allowNegative: false,
      allowLeadingZeroes: false,
    });
  }

  private getUserProfileData(): void {
    this.adminService.getUserProfileDataForEdit(this.userId).subscribe(
        (data) => {
          this.userProfileData = data;

          if (this.userProfileData.profilePhoto) {
            this.userProfileData.profilePhoto.isLoading = false;
          }

          if (this.userProfileData.certificate) {
            this.userProfileData.isDroneOperatorLicense = true;
            this.uploadedCertificate = this.userProfileData.certificate as UploadedFile;
            UploadedFile.setClientSideData(this.uploadedCertificate);
          } else {
            this.userProfileData.isDroneOperatorLicense = false;
          }

          if (this.userProfileData.videos) {
            this.setProfileLinks('videoLinks', this.userProfileData.videos);
          }

          if (this.userProfileData.resources) {
            this.setProfileLinks('additionalInfoLinks', this.userProfileData.resources);
          }

          if (Array.isArray(this.userProfileData.images) && this.userProfileData.images.length !== 0) {
            const tmpUploadedImages = Array.prototype.map.call(this.userProfileData.images, (image) => {
              const tmpImage = Object.assign({}, image);
              UploadedFile.setClientSideData(tmpImage);

              return tmpImage;
            });
            this.uploadedImages = tmpUploadedImages as UploadedFile[];
          }
        },
        () => {
          this.messagesService.showError('user_profile.get_user_profile_information.message_error');
        }
    );
  }

  private uploadFileOnServer(element: HTMLInputElement, targetFile: UploadedFile, fileType: UploadedFileType) {

    const saveOptions: UploadedFileSaveOptions = this.getOptionsForUploadFileOnServer(fileType);

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

    if (this.validationService.isFileSizeLessMb(file, 5) === false) {
      UploadedFile.addError(targetFile, saveOptions.sizeErrorMessage);
      this.toaster.error(targetFile.errorMessage);
      return false;
    }

    this.userService[saveOptions.serviceMethod](file)
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
          targetFile.size200 = data.size200;
          targetFile.logo = data.logo;
          targetFile.fullName = data.fullName;
          targetFile.isInvalid = false;
        },
        (errorData: any) => {
          const serverErrorMessage = this.callbackService.getErrorMessage(errorData);

          UploadedFile.addError(targetFile, serverErrorMessage);
          this.toaster.error(serverErrorMessage);
        });
  }

  private getOptionsForUploadFileOnServer(type: UploadedFileType): UploadedFileSaveOptions {
    const options = new UploadedFileSaveOptions();

    switch (type) {
      case UploadedFileType.CERTIFICATE:
        options.serviceMethod = UploadedFileServiceMethod.UPLOAD_CERTIFICATE;
        options.acceptedExtension = this.acceptsOfCertificate;
        options.extensionErrorMessage = `Only ${options.acceptedExtension} accepted`;
        options.sizeErrorMessage = 'Document size should be less than 5Mb';
        break;
      case UploadedFileType.PROFILE_PHOTO:
        options.serviceMethod = UploadedFileServiceMethod.UPLOAD_PROFILE_PHOTO;
        options.acceptedExtension = this.acceptsOfImage;
        options.extensionErrorMessage = `Only ${options.acceptedExtension} accepted`;
        options.sizeErrorMessage = 'Image size should be less than 5Mb';
        break;
      case UploadedFileType.IMAGE:
      default:
        options.serviceMethod = UploadedFileServiceMethod.UPLOAD_IMAGE;
        options.acceptedExtension = this.acceptsOfImage;
        options.extensionErrorMessage = `Only ${options.acceptedExtension} accepted`;
        options.sizeErrorMessage = 'Image size should be less than 5Mb';
    }

    return options;
  }

  private initUserProfileForm(): void {
    this.userProfileForm = new FormGroup({
      videoLinks: new FormArray([
        new FormControl('', Validators.pattern(MEDIA_URL_REGEX)),
        new FormControl('', Validators.pattern(MEDIA_URL_REGEX)),
        new FormControl('', Validators.pattern(MEDIA_URL_REGEX)),
        new FormControl('', Validators.pattern(MEDIA_URL_REGEX)),
        new FormControl('', Validators.pattern(MEDIA_URL_REGEX))
      ]),
      additionalInfoLinks: new FormArray([
        new FormControl('', Validators.pattern(URL_REGEX))
      ]),
      homeAddress: new FormControl('', Validators.required),
    });
  }

  private getCertificate(): UploadedFile {
    return this.uploadedCertificate || new UploadedFile();
  }

  private getImageByIndex(index: number): UploadedFile {
    return this.uploadedImages[index] || new UploadedFile();
  }

  private deleteUploadedFile(targetFile: UploadedFile, index: number) {
    UploadedFile.resetData(targetFile);

    if (this.uploadedImages.length === MIN_COUNT_OF_UPLOADED_IMAGES) {
      Array.prototype.splice.call(this.uploadedImages, index, 1, new UploadedFile());
    } else {
      Array.prototype.splice.call(this.uploadedImages, index, 1);
    }
  }

  private fillUserProfileForSave(currentProfile: UserProfileForEditData): UserProfileForEditData {

    // Deep copy of object
    const profileToSave = JSON.parse(JSON.stringify(currentProfile));

    profileToSave.profilePhoto = this.userProfileData.profilePhoto;

    if ((this.isSelectedRole(WorkerRoleEnum.PHOTOGRAPHER) === true || this.isSelectedRole(WorkerRoleEnum.VIDEOGRAPHER) === true) &&
        profileToSave.isDroneOperatorLicense === true) {
      profileToSave.certificate = this.uploadedCertificate.url;
    } else {
      delete profileToSave.certificate;
    }

    if (this.isSelectedRole(WorkerRoleEnum.PHOTOGRAPHER) === true || this.isSelectedRole(WorkerRoleEnum.PHOTO_EDITOR) === true) {
      profileToSave.images = this.uploadedImages.reduce(
          (newArr, image) => {
            if (typeof image.url === 'string' && image.url.trim().length > 0 && image.isInvalid === false && image.isLoading === false) {
              return [...newArr, image.url];
            } else {
              return newArr;
            }
          },
          []
      );
    } else {
      delete profileToSave.images;
    }

    if (this.isSelectedRole(WorkerRoleEnum.VIDEOGRAPHER) === true || this.isSelectedRole(WorkerRoleEnum.VIDEO_EDITOR) === true) {
      const videoLinks = this.userProfileForm.get('videoLinks').getRawValue();
      profileToSave.videos = videoLinks.filter((value: string) => value.trim().length > 0);
    } else {
      delete profileToSave.videos;
    }

    if (this.userProfileForm.get('additionalInfoLinks').controls[0].value !== null) {
      const additionalInfoLinks = this.userProfileForm.get('additionalInfoLinks').getRawValue();
      profileToSave.resources = additionalInfoLinks.filter((value: string) => value.trim().length > 0);
    }

    /*
     * Use this method in the End
     * some client side variables using for correct fill user profile
     */
    UserProfileForEditData.removeClientSideData(profileToSave);

    return profileToSave;
  }

  private validateUserProfileAndShowMessage(profileForValidation: UserProfileForEditData): boolean {

    if (this.validationService.isStringNotEmpty(profileForValidation.profilePhoto.url) === false) {
      this.messagesService.showError('profile.upload_profile_photo.message_error');
      return false;
    }

    if (!profileForValidation.profileLocation || this.validationService.isStringNotEmpty(profileForValidation.profileLocation.address) ===
        false) {
      return this.showAutocompleteError();
    } else if (!profileForValidation.profileLocation.lat || !profileForValidation.profileLocation.lng) {
      return this.showAutocompleteError();
    }

    if (!profileForValidation.businessLocation || this.validationService.isStringNotEmpty(profileForValidation.businessLocation.address) ===
        false) {
      return this.showAutocompleteError();
    } else if (!profileForValidation.businessLocation.lat || !profileForValidation.businessLocation.lng) {
      return this.showAutocompleteError();
    }

    if (this.validationService.isStringNotEmpty(profileForValidation.publicBio) === false) {
      this.messagesService.showError('profile.public_bio_is_required');
      return false;
    } else if (this.validationService.isWordsLessThan(profileForValidation.publicBio, 50)) {
      this.messagesService.showError('profile.public_bio_should_be_50_words_or_more');
      return false;
    }

    if (profileForValidation.experience === null || typeof profileForValidation.experience === 'undefined' ||
        this.validationService.isStringNotEmpty(profileForValidation.experience) === false) {
      this.messagesService.showError('profile.experience_is_required.message_error');
      return false;
    }

    if (this.validationService.isArrayNotEmpty(profileForValidation.roles) === false) {
      this.messagesService.showError('profile.have_not_select_speciality');
      return false;
    }

    if (this.validationService.isStringNotEmpty(profileForValidation.abn) === false) {
      this.messagesService.showError('user_profile.enter_ABN.message_error');
      return false;
    }

    if (this.validationService.isStringNotEmpty(profileForValidation.businessName) === false) {
      this.messagesService.showError('user_profile.enter_business_name.message_error');
      return false;
    }

    if (this.validationService.isStringNotEmpty(profileForValidation.webAddress) === false) {
      this.messagesService.showError('user_profile.enter_website.message_error');
      return false;
    } else if (profileForValidation.webAddress.match(URL_REGEX) === null) {
      this.messagesService.showError('user_profile.website_not_valid.message_error');
      return false;
    }

    if (profileForValidation.roles.some(
        (role) => role === WorkerRoleEnum.PHOTOGRAPHER || role === WorkerRoleEnum.PHOTO_EDITOR)) {

      const isImagesNotEmpty = this.validationService.isArrayNotEmpty(profileForValidation.images) === false;
      if (isImagesNotEmpty || profileForValidation.images.length < 10) {
        this.messagesService.showError('profile.upload_10_or_more_photos');
        return false;
      }

    }

    if (profileForValidation.roles.some(
        (role) => role === WorkerRoleEnum.VIDEOGRAPHER || role === WorkerRoleEnum.VIDEO_EDITOR)) {
      if (this.validationService.isArrayNotEmpty(profileForValidation.videos) === false || profileForValidation.videos.length < 5) {
        this.messagesService.showError('profile.add_5_or_more_video_links');
        return false;
      }

    }

    if ((this.isSelectedRole(WorkerRoleEnum.PHOTOGRAPHER) || this.isSelectedRole(WorkerRoleEnum.VIDEOGRAPHER)) &&
        this.userProfileData.isDroneOperatorLicense === true &&
        (profileForValidation.certificate === null || typeof profileForValidation.certificate === 'undefined' ||
         profileForValidation.certificate === '')) {
      this.messagesService.showError('profile.get_upload_drone_licence_error');
      return false;
    }

    return true;

  }

  private showAutocompleteError(): boolean {
    this.messagesService.showError('google_autocomplete.choose_address_from_dropdown');
    return false;
  }

  private splitDataBeforeSend(profileToSend: UserProfileForEditData): void {
    // Business data fill
    this.editedData.businessProfileData.abn = profileToSend.abn;
    this.editedData.businessProfileData.gst = profileToSend.gst;
    this.editedData.businessProfileData.location = profileToSend.businessLocation;
    this.editedData.businessProfileData.businessName = profileToSend.businessName;
    this.editedData.businessProfileData.webAddress = profileToSend.webAddress;

    // Profile data fill
    this.editedData.userProfileData.certificate = profileToSend.certificate;
    this.editedData.userProfileData.images = profileToSend.images;
    this.editedData.userProfileData.videos = profileToSend.videos;
    this.editedData.userProfileData.resources = profileToSend.resources;
    this.editedData.userProfileData.experience = profileToSend.experience;
    this.editedData.userProfileData.equipment = profileToSend.equipment;
    this.editedData.userProfileData.location = profileToSend.profileLocation;
    this.editedData.userProfileData.profilePhoto = profileToSend.profilePhoto;
    this.editedData.userProfileData.publicBio = profileToSend.publicBio;
    this.editedData.userProfileData.roles = profileToSend.roles;
  }

  public isFieldsValid(fields: string, index: number): boolean {
    if (this.userProfileForm.get(fields).controls[index].value !== '' &&
        this.userProfileForm.get(fields).controls[index].value.trim() === '') {
      this.messagesService.showError('profile.get_input_error');
      return false;
    }

    if (this.userProfileForm.get(fields).controls[index].hasError('pattern')) {
      this.messagesService.showError('profile.get_url_error');
      return false;
    }
  }

  public uploadImage(event: {target: HTMLInputElement}, index: number) {
    const target: HTMLInputElement = event.target;
    const targetFile = this.getImageByIndex(index);

    this.uploadFileOnServer(target, targetFile, UploadedFileType.IMAGE);
  }

  public uploadCertificate(event: {target: HTMLInputElement}) {
    const target: HTMLInputElement = event.target;
    const targetFile = this.uploadedCertificate;

    this.uploadFileOnServer(target, targetFile, UploadedFileType.CERTIFICATE);
  }

  public deleteImage(index: number) {
    const targetFile = this.getImageByIndex(index);

    if (this.validationService.isStringNotEmpty(targetFile.fullName) === false) {
      this.deleteUploadedFile(targetFile, index);
      return;
    }

    targetFile.isLoading = true;

    this.userService.deleteImage(targetFile.fullName)
    .finally(() => targetFile.isLoading = false)
    .subscribe(
        (data: UploadFileResponse) => {
          this.deleteUploadedFile(targetFile, index);
        },
        (errorData: any) => {
          this.toaster.error(this.callbackService.getErrorMessage(errorData));
        });
  }

  public deleteCertificate() {
    const userCertificate = this.getCertificate();

    if (this.validationService.isStringNotEmpty(userCertificate.fullName) === false) {
      UploadedFile.resetData(userCertificate);
      return;
    }

    userCertificate.isLoading = true;

    this.userService.deleteCertificate(userCertificate.fullName)
    .finally(() => userCertificate.isLoading = false)
    .subscribe(
        (data: UploadFileResponse) => {
          UploadedFile.resetData(userCertificate);
        },
        (errorData: any) => {
          this.toaster.error(this.callbackService.getErrorMessage(errorData));
        });
  }

  public getPhotoStyle(): Object {
    const {url, isLoading, size200} = this.userProfileData.profilePhoto;

    if (url && isLoading === false) {
      return {
        'background-image': `url("${size200 || url}")`,
      };
    } else {
      return {};
    }
  }

  public uploadProfilePhoto(event: {target: HTMLInputElement}): void {
    const target: HTMLInputElement = event.target;
    const targetFile = this.userProfileData.profilePhoto;

    this.uploadFileOnServer(target, targetFile, UploadedFileType.PROFILE_PHOTO);
  }

  public deleteProfilePhoto(): boolean {
    this.userProfileData.profilePhoto.isLoading = true;

    this.userService.deleteProfileImage(this.userProfileData.profilePhoto.fullName)
    .finally(() => this.userProfileData.profilePhoto.isLoading = false)
    .subscribe(
        (data: UploadFileResponse) => {
          UploadedFile.resetData(this.userProfileData.profilePhoto);
        },
        (errorData: any) => {
          this.toaster.error(this.callbackService.getErrorMessage(errorData));
        });

    return false;
  }

  public isSelectedRole(role: WorkerRoleEnum): boolean {
    return (this.userProfileData.roles || []).some((roleItem) => roleItem === role);
  }


  public deleteVideoLinks(index: number): void {
    this.userProfileForm.get('videoLinks').controls.splice(index, 1);
  }

  public setProfileLinks(fields: string, fieldsData: string[] | string): void {
    for (let i = 0; i < fieldsData.length; i++) {
      this.userProfileForm.get(fields).controls[i] = new FormControl(fieldsData[i]);
    }
  }

  public addUploadedImages(): void {
    if (this.uploadedImages.length < MAX_COUNT_OF_UPLOADED_IMAGES) {
      this.uploadedImages = [...this.uploadedImages, new UploadedFile()];
    }
  }

  public addVideoLinks(): void {
    if (this.userProfileForm.get('videoLinks').controls.length < MAX_COUNT_OF_VIDEO_URLS) {
      this.userProfileForm.get('videoLinks').controls = [...this.userProfileForm.get('videoLinks').controls,
                                                         new FormControl('', Validators.pattern(MEDIA_URL_REGEX))];
    }
  }

  public getAddress(data: GoogleAutocompleteResult, type: GoogleAutoCompleteTypeEnum): void {
    if (type === this.GoogleAutoCompleteTypeEnum.PROFILE_LOCATION) {
      this.userProfileData.profileLocation = {
        address: data.input,
        lng: data.place.geometry.location.lng(),
        lat: data.place.geometry.location.lat(),
      };
    } else if (type === this.GoogleAutoCompleteTypeEnum.BUSINESS_LOCATION) {
      this.userProfileData.businessLocation = {
        address: data.input,
        lng: data.place.geometry.location.lng(),
        lat: data.place.geometry.location.lat(),
      };
    }
  }

  public toggleRole(role: WorkerRoleEnum, event: MatCheckboxChange): void {
    if (event.checked === true) {
      this.userProfileData.roles = [...this.userProfileData.roles, role];
    } else {
      this.userProfileData.roles = this.userProfileData.roles.filter((roleItem) => roleItem !== role);
    }
  }

  public addMoreProfileResources() {
    if (this.userProfileForm.get('additionalInfoLinks').controls.length < MAX_COUNT_OF_ADDITIONAL_LINKS) {
      this.userProfileForm.get('additionalInfoLinks').controls = [...this.userProfileForm.get('additionalInfoLinks').controls,
                                                                  new FormControl('', Validators.pattern(URL_REGEX))];
    }
  }

  public deleteAdditionalProfileResourcesLinks(index: number) {
    this.userProfileForm.get('additionalInfoLinks').controls.splice(index, 1);
  }

  public setProfileEquipment(newEquipment: string[]): void {
    this.userProfileData.equipment = [...newEquipment];
  }

  public editProfile() {

    const profileToSave = this.fillUserProfileForSave(this.userProfileData);

    if (this.validateUserProfileAndShowMessage(profileToSave) === false) {
      return;
    }

    this.isRequestInProgress = true;

    this.splitDataBeforeSend(profileToSave);

    this.adminService.editUserProfile(this.editedData, this.userId)
    .subscribe(
        () => {
          this.messagesService.showSuccess('user_profile.edited_from_admin.message_success');

          // Redirecting after success
          Observable.timer(3000)
          .subscribe(() => {
            this.router.navigate(['/admin/dashboard']);
          });
        },
        () => {
          this.messagesService.showError('user_profile.edit_from_admin.message_error');
          this.isRequestInProgress = false;
        }
    );
  }
}
