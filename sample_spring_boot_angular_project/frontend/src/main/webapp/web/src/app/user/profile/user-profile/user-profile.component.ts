import { Component, Injector, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { User, UserStatus } from '../../../auth/auth.model';

import { AuthService } from '../../../auth/auth.service';
import { PermissibleRouteService } from '../../../auth/authorization/permissible-route.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { MessagesService } from '../../../utils/messages.service';
import { SessionStorageService } from '../../../utils/storage/session-storage.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { ValidationService } from '../../../utils/validation.service';

import { GoogleAutocompleteResult } from '../../../shared/google-autocomplete/google-autocomplete.model';
import { UserService } from '../../user.service';
import {
  UploadFileResponse,
  WorkerRoleEnum,
  UploadedFile,
  UserProfile,
  ExperienceEnum,
  Experience,
  ExperienceLabelEnum,
  UploadedFileType, UploadedFileSaveOptions, UploadedFileServiceMethod, UserNames
} from '../../user.model';

// TODO move to file
const MEDIA_URL_REGEX = /^(((http(s))|(Http(s)))?:\/\/)?(m.|player.|www.)?(vimeo\.com|wistia|mediazilla|facebook|youtu(be|.be))?(\.com)?\/.+/;
const URL_REGEX = /^(((http)|(https)|(Http)|(Https))?:\/\/)??[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/;

const MIN_COUNT_OF_UPLOADED_IMAGES = 10;
const MIN_COUNT_OF_VIDEO_URLS = 5;
const MIN_COUNT_OF_ADDITIONAL_LINKS = 1;
const MAX_COUNT_OF_UPLOADED_IMAGES = 20;
const MAX_COUNT_OF_VIDEO_URLS = 10;
const MAX_COUNT_OF_ADDITIONAL_LINKS = 5;

@Component({
  selector: 'zu-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  public readonly WorkerRoleEnum = WorkerRoleEnum;

  public readonly MAX_COUNT_OF_UPLOADED_IMAGES = MAX_COUNT_OF_UPLOADED_IMAGES;
  public readonly MAX_COUNT_OF_VIDEO_URLS = MAX_COUNT_OF_VIDEO_URLS;
  public readonly MAX_COUNT_OF_ADDITIONAL_LINKS = MAX_COUNT_OF_ADDITIONAL_LINKS;
  public readonly MIN_COUNT_OF_VIDEO_URLS = MIN_COUNT_OF_VIDEO_URLS;
  public readonly MIN_COUNT_OF_ADDITIONAL_LINKS = MIN_COUNT_OF_ADDITIONAL_LINKS;
  public readonly userStatusEnum = UserStatus;

  public userRole: string | null;
  userProfileForm: any;

  public profilePhoto = new UploadedFile();
  public uploadedImages: UploadedFile[];
  public uploadedCertificate = new UploadedFile();
  public acceptsOfImage = '.jpg,.jpeg,.JPG,.JPEG';
  public acceptsOfCertificate = '.pdf,.jpg,.jpeg,.png,.PDF,.JPG,.JPEG,.PNG';

  public adminFeedback: string;

  public experienceList: Experience[];
  public profile: UserProfile;

  public saveProfileBtnDisabled = false;
  public googleAutocompleteData: string;
  private isProfileExist: boolean;

  public additionalLinksInfoMessage = `Here you can add more links to showcase your work such as Instagram, Facebook, Pinterest,
                                      'Google Plus, YouTube etc...`;
  public videoLinksInfoMessage = `Just links from Vimeo, YouTube, Wistia, Mediazilla, and Facebook.
                                  Your website can be displayed in the Show Us More section.`;
  public equipmentInfoMessage = 'Be specific about the main equipment you use, such as camera brand, make and model, lens, ' +
                                'audio devices etc.';
  public messageLabel = 'Oops! We need some more information before we can set up your Shootzu profile:';

  public userNames: UserNames;
  public user: User;
  public profileId: string;

  private platform: Platform;

  public introHeader = {
    title: 'MAKE YOUR ZU MEMBERSHIP COUNT!',
    subTitle: 'Keep your public profile up to date',
    description: `Your profile information will be sent to businesses when you apply for a job\.
    Keep adding to your profile and portfolio - be noticed\!
    \<br\>Your portfolio should showcase the best you have to offer\.`,
  };

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

  constructor(
      private authService: AuthService,
      private permissibleRouteService: PermissibleRouteService,
      private userService: UserService,
      private toaster: ToasterConfigService,
      private callbackService: CallbackHandlerService,
      private validationService: ValidationService,
      private router: Router,
      private messagesService: MessagesService,
      private sessionStorageService: SessionStorageService,
      private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  ngOnInit() {
    this.profile = new UserProfile();
    this.userRole = null;

    this.initUserProfileForm();

    this.profile.experience = null;

    this.experienceList = UserProfileComponent.getDefaultExperience();

    this.uploadedImages = UserProfileComponent.getDefaultImageList();

    this.getUserDataWithAdminFeedback();

    this.getUserNames();

    this.user = this.sessionStorageService.getObject<User>('user');
    this.getProfileId();

    this.isProfileExist = true ? this.user.status !== this.userStatusEnum.NEW : false;
  }

  public getProfilePhotoAccept() {
    try {
      if (this.platform.is('mobile')) {
        return 'image/*';
      } else {
        return this.acceptsOfImage;
      }
    } catch (e) {
      return this.acceptsOfImage;
    }
  }

  private getUserDataWithAdminFeedback() {
    this.userService.getUserProfile().subscribe((data: UserProfile) => {
      if (!data) {
        return;
      }

      if (data.profilePhoto !== null) {
        this.profilePhoto.url = data.profilePhoto['url'];
        this.profilePhoto.size200 = data.profilePhoto['size200'];
      }

      this.profile = data;
      this.adminFeedback = data.adminsComment;
      this.profile.roles = data.roles;

      if (this.profile.certificate) {
        this.profile.isDroneOperatorLicense = true;
        this.uploadedCertificate = this.profile.certificate as UploadedFile;
        UploadedFile.setClientSideData(this.uploadedCertificate);
      } else {
        this.profile.isDroneOperatorLicense = false;
      }

      if (this.profile.videos) {
        this.setProfileLinks('videoLinks', this.profile.videos, MEDIA_URL_REGEX);
      }

      if (this.profile.resources) {
        this.setProfileLinks('additionalInfoLinks', this.profile.resources, URL_REGEX);
      }

      if (Array.isArray(this.profile.images) && this.profile.images.length !== 0) {
        const tmpUploadedImages = Array.prototype.map.call(this.profile.images, (image) => {
          const tmpImage = Object.assign({}, image);
          UploadedFile.setClientSideData(tmpImage);

          return tmpImage;
        });
        this.uploadedImages = tmpUploadedImages as UploadedFile[];
      }

      if (this.profile.location !== null) {
        this.googleAutocompleteData = this.profile.location['address'];
      }
    });
  }

  private getUserNames() {
    this.userService.getUserNames()
    .subscribe(
        (data: UserNames) => {
          this.userNames = data;
        },
        () => {
          this.messagesService.showError('');
        });
  }

  public setProfileLinks(fields: string, fieldsData: string[] | string, pattern: RegExp) {
    for (let i = 0; i < fieldsData.length; i++) {
      this.userProfileForm.get(fields).controls[i] = new FormControl(fieldsData[i], Validators.pattern(pattern));
    }
  }

  public getAddress(data: GoogleAutocompleteResult) {
    this.profile.location = {
      address: data.input,
      lng: data.place.geometry.location.lng(),
      lat: data.place.geometry.location.lat(),
    };
  }

  public deleteProfilePhoto() {
    this.profilePhoto.isLoading = true;

    this.userService.deleteProfileImage(this.profilePhoto.fullName)
    .finally(() => this.profilePhoto.isLoading = false)
    .subscribe(
        (data: UploadFileResponse) => {
          UploadedFile.resetData(this.profilePhoto);
        },
        (errorData: any) => {
          this.toaster.error(this.callbackService.getErrorMessage(errorData));
        });

    return false;
  }

  public addUploadedImages() {
    if (this.uploadedImages.length < MAX_COUNT_OF_UPLOADED_IMAGES) {
      this.uploadedImages = [...this.uploadedImages, new UploadedFile()];
    }
  }

  public addVideoLinks() {
    if (this.userProfileForm.get('videoLinks').controls.length < MAX_COUNT_OF_VIDEO_URLS) {
      this.userProfileForm.get('videoLinks').controls = [...this.userProfileForm.get('videoLinks').controls,
                                                         new FormControl('', Validators.pattern(MEDIA_URL_REGEX))];
    }
  }

  public deleteVideoLinks(index: number) {
    this.userProfileForm.get('videoLinks').controls.splice(index, 1);
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

  /* Upload files on server functions */

  public uploadCertificate(event: {target: HTMLInputElement}) {
    const target: HTMLInputElement = event.target;
    const targetFile = this.uploadedCertificate;

    this.uploadFileOnServer(target, targetFile, UploadedFileType.CERTIFICATE);
  }

  public uploadProfilePhoto(event: {target: HTMLInputElement}) {
    const target: HTMLInputElement = event.target;
    const targetFile = this.profilePhoto;

    this.uploadFileOnServer(target, targetFile, UploadedFileType.PROFILE_PHOTO);
  }

  public uploadImage(event: {target: HTMLInputElement}, index: number) {
    const target: HTMLInputElement = event.target;
    const targetFile = this.getImageByIndex(index);

    this.uploadFileOnServer(target, targetFile, UploadedFileType.IMAGE);
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

  /* End of upload files on server functions */

  private initUserProfileForm() {
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

  // add a new profile role if checkbox is checked and delete if unchecked
  public toggleRole(role: WorkerRoleEnum, event: MatCheckboxChange) {
    if (event.checked === true) {
      this.profile.roles = [...this.profile.roles, role];
    } else {
      this.profile.roles = this.profile.roles.filter((roleItem) => roleItem !== role);
    }
  }

  public isSelectedRole(role: WorkerRoleEnum): boolean {
    return (this.profile.roles || []).some((roleItem) => roleItem === role);
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

  private deleteUploadedFile(targetFile: UploadedFile, index: number) {
    UploadedFile.resetData(targetFile);

    if (this.uploadedImages.length === MIN_COUNT_OF_UPLOADED_IMAGES) {
      Array.prototype.splice.call(this.uploadedImages, index, 1, new UploadedFile());
    } else {
      Array.prototype.splice.call(this.uploadedImages, index, 1);
    }
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

  private getImageByIndex(index: number): UploadedFile {
    return this.uploadedImages[index] || new UploadedFile();
  }

  private getCertificate(): UploadedFile {
    return this.uploadedCertificate || new UploadedFile();
  }

  private getProfileId(): void {
    if (this.user.status !== UserStatus.EDITED && this.user.status !== UserStatus.VERIFICATION_SUCCESS) {
      return;
    }

    this.userService.getProfileId(this.user.id)
    .subscribe(
        (data) => {
          this.profileId = data.profileId;
        },
        () => {
          //          TODO uncomment
          //          this.messagesService.showError('common.message_error');
        }
    );
  }

  public getPhotoStyle() {
    const {url, isLoading, size200} = this.profilePhoto;

    if (url && isLoading === false) {
      return {
        'background-image': `url("${size200 || url}")`,
      };
    } else {
      return {};
    }
  }

  public saveUserProfile() {

    const profileToSave = this.fillUserProfileForSave(this.profile);

    if (this.validateUserProfileAndShowMessage(profileToSave) === false) {
      return;
    }

    this.saveProfileBtnDisabled = true;

    const methodAPI = this.isProfileExist === true ? 'updateUserProfile' : 'saveUserProfile';

    this.userService[methodAPI](profileToSave)
    .subscribe(
        () => {
          if (methodAPI === 'saveUserProfile') {
            this.toaster.success('Profile successfully created!');
            this.router.navigate(['/user-profile/pending']);
          } else {
            this.messagesService.showSuccess('user_profile.edited.message_success');
            this.router.navigate([`/profile/${this.profileId}`]);
          }
        },
        (errorData) => {
          this.messagesService.showError(errorData.error.message);
          this.saveProfileBtnDisabled = false;
        });
  }

  private showAutocompleteError(): boolean {
    this.messagesService.showError('google_autocomplete.choose_address_from_dropdown');
    return false;
  }

  private validateUserProfileAndShowMessage(profileForValidation: UserProfile): boolean {

    if (this.validationService.isStringNotEmpty(profileForValidation.profilePhoto) === false) {
      this.messagesService.showError('profile.upload_profile_photo.message_error');
      return false;
    }

    if (!profileForValidation.location || this.validationService.isStringNotEmpty(profileForValidation.location.address) === false) {
      return this.showAutocompleteError();
    } else if (!profileForValidation.location.lat || !profileForValidation.location.lng) {
      return this.showAutocompleteError();
    }

    //    if (this.validationService.isStringNotEmpty(profileForValidation.businessName) === false) {
    //      this.toaster.error('Business name is required field.');
    //      return false;
    //    }

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

      if (profileForValidation.videos.some((item) => this.validationService.isURLValid(item, MEDIA_URL_REGEX) === false)) {
        this.messagesService.showError('profile.get_media_url_error');
        this.validateFieldsForPattern('videoLinks');
        return false;
      }

    }

    if ((this.isSelectedRole(WorkerRoleEnum.PHOTOGRAPHER) || this.isSelectedRole(WorkerRoleEnum.VIDEOGRAPHER)) &&
        this.profile.isDroneOperatorLicense === true &&
        (profileForValidation.certificate === null || typeof profileForValidation.certificate === 'undefined' ||
         profileForValidation.certificate === '')) {
      this.messagesService.showError('profile.get_upload_drone_licence_error');
      return false;
    }

    if (profileForValidation.resources.some((item) => this.validationService.isURLValid(item, URL_REGEX) === false)) {
      this.messagesService.showError('profile.get_url_error');
      this.validateFieldsForPattern('additionalInfoLinks');
      return false;
    }

    return true;

  }

  private fillUserProfileForSave(currentProfile: UserProfile): UserProfile {

    // Deep copy of object
    const profileToSave = JSON.parse(JSON.stringify(currentProfile));

    profileToSave.profilePhoto = this.profilePhoto.url;

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
    UserProfile.removeClientSideData(profileToSave);

    return profileToSave;
  }

  // Validation
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

  private validateFieldsForPattern(field: string): void {
    this.userProfileForm.get(field).controls.forEach((control) => {
      if (control.hasError('pattern')) {
        control.markAsTouched();
      }
    });
  }

  private validateURLs(profileForValidation: UserProfile): boolean {

    if (profileForValidation.roles.some(
        (role) => role === WorkerRoleEnum.VIDEOGRAPHER || role === WorkerRoleEnum.VIDEO_EDITOR)) {

      if (profileForValidation.videos.some((item) => this.validationService.isURLValid(item, MEDIA_URL_REGEX) === false)) {
        this.messagesService.showError('profile.get_media_url_error');
        this.validateFieldsForPattern('videoLinks');
        return false;
      }

    }

    if (profileForValidation.resources.some((item) => this.validationService.isURLValid(item, URL_REGEX) === false)) {
      this.messagesService.showError('profile.get_url_error');
      this.validateFieldsForPattern('additionalInfoLinks');
      return false;
    }

    return true;

  }

  private isProfileNotEmpty(obj: UserProfile): boolean {
    //    TODO
    let res = false;

    if ((obj.location === null || obj.location === undefined || obj.location.address === '') &&
        (obj.profilePhoto === undefined || obj.profilePhoto === null) &&
        obj.roles.length === 0 &&
        obj.resources.length === 0 &&
        obj.equipment.length === 0 &&
        obj.experience === null &&
        (obj.publicBio === null || obj.publicBio === undefined || obj.publicBio === '')) {
      this.toaster.error('You must fill at least 1 field!');
    } else {
      res = true;
    }

    return res;
  }

  public setProfileEquipment(newEquipment: string[]): void {
    this.profile.equipment = [...newEquipment];
  }

  public saveProfileForLater(): void {

    const profileToSave = this.fillUserProfileForSave(this.profile);

    if (this.isProfileNotEmpty(profileToSave) === false || this.validateURLs(profileToSave) === false) {
      return;
    }

    this.userService.saveProfileForLater(profileToSave).subscribe(
        () => {
          this.toaster.success('Saved for later!');
        },
        (err) => {
          this.toaster.error(err.message);
        }
    );
  }
}
