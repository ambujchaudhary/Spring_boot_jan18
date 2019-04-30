import { Component, OnInit } from '@angular/core';
import { e } from '@angular/core/src/render3';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserStatus } from '../../auth/auth.model';
import { MessagesService } from '../../utils/messages.service';
import { SessionStorageService } from '../../utils/storage/session-storage.service';
import { Location, BusinessProfileData } from '../user.model';
import { GoogleAutocompleteResult } from '../../shared/google-autocomplete/google-autocomplete.model';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ValidationService } from '../../utils/validation.service';
import { createNumberMask } from 'text-mask-addons/dist/textMaskAddons';

const URL_REGEX = /^(((http)|(https)|(Http)|(Https))?:\/\/)??[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/;

@Component({
  selector: 'zu-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss'],
})

export class BusinessProfileComponent implements OnInit {

  public businessProfileForm: FormGroup;
  public autocompleteLocation: Location;
  public isRequestInProgress: boolean;
  public isProfileExist: boolean;
  public user: User;

  public readonly userStatusEnum = UserStatus;

  // For GET API
  businessName: string;
  abn: string;
  website: string;
  gst: boolean;
  mask: any;

  constructor(private toaster: ToasterConfigService,
              private callbackService: CallbackHandlerService,
              private userService: UserService,
              private router: Router,
              private validationService: ValidationService,
              private messagesService: MessagesService,
              private sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.initBusinessProfileForm();
    this.getBusinessProfileData();

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

    this.user = this.sessionStorageService.getObject<User>('user');
  }

  private isAllFieldFill(businessProfileData: BusinessProfileData): boolean {

    const {
      businessName = '',
      webAddress = '',
      abn = '',
    } = businessProfileData;

    return this.validationService.isStringNotEmpty(businessName) &&
           this.validationService.isStringNotEmpty(webAddress) &&
           this.validationService.isStringNotEmpty(this.businessProfileForm.get('location').value) &&
           this.validationService.isStringNotEmpty(abn);
  }

  private initBusinessProfileForm() {
    this.businessProfileForm = new FormGroup({
      businessName: new FormControl('', Validators.required),
      abn: new FormControl('', Validators.required),
      webAddress: new FormControl('', [Validators.required, Validators.pattern(URL_REGEX)]),
      location: new FormControl('', Validators.required),
      gst: new FormControl(''),
    });
  }

  private isValidAutocompleteLocation() {
    let result = false;

    const isTextFieldEmpty = this.validationService.isStringNotEmpty(this.businessProfileForm.get('location').value);
    if ((isTextFieldEmpty && (!this.autocompleteLocation.lat || !this.autocompleteLocation.lng)) === false) {
      result = true;
    }

    return result;
  }

  private validationBeforeSend() {
    let result = false;

    if (this.isAllFieldFill(this.businessProfileForm.value) === false) {
      this.messagesService.showError('common.all_fields_are_mandatory');
    } else if (this.businessProfileForm.get('gst').value === undefined) {
      this.messagesService.showError('business_profile.are_you_registered_for_TAX');
    } else if (this.businessProfileForm.get('webAddress').hasError('pattern')) {
      this.messagesService.showError('profile.get_url_error');
    } else if (this.isValidAutocompleteLocation() === false) {
      this.messagesService.showError('google_autocomplete.choose_address_from_dropdown');
    } else {
      result = true;
    }

    return result;
  }

  private getBusinessProfileData() {
    this.userService.getBusinessProfile().subscribe((data: BusinessProfileData) => {
      if (!data) {
        this.isProfileExist = false;
        return;
      }

      this.isProfileExist = true;
      this.businessName = data.businessName;
      this.abn = data.abn;
      this.website = data.webAddress;
      this.gst = data.gst;
      this.businessProfileForm.get('location').setValue(data.location['address']);
      this.autocompleteLocation = data.location;
    });
  }

  public getAddress(data: GoogleAutocompleteResult) {
    this.autocompleteLocation = {
      address: data.input,
      lng: data.place.geometry.location.lng(),
      lat: data.place.geometry.location.lat(),
    };
  }

  public sendBusinessProfileFormData() {
    this.validationBeforeSend();
    if (this.validationBeforeSend() !== true) {
      return;
    }

    this.businessProfileForm.value.location = this.autocompleteLocation;

    const methodAPI = this.isProfileExist === true ? 'updateBusinessProfile' : 'saveBusinessProfile';

    this.userService[methodAPI](this.businessProfileForm.value)
    .subscribe(
        () => {
          this.isRequestInProgress = true;

          if (this.user.status === this.userStatusEnum.NO_BUSINESS) {
            this.messagesService.showSuccess('business_profile.done.message_success');
            this.router.navigate(['/profile']);
          } else {
            this.messagesService.showSuccess('business_profile.edited.message_success');
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          if (error.error.message === 'Business profile already set') {
            this.toaster.error(this.callbackService.getErrorMessage(error));
            this.router.navigate(['/']);
          } else {
            this.toaster.error(this.callbackService.getErrorMessage(error));
            this.isRequestInProgress = false;
          }
        });
  }

  public setStyles(element: 'section' | 'list') {
    switch (element) {
      case 'section':
        if (this.user.status === this.userStatusEnum.NO_BUSINESS) {
          return 'public-page-backgroud';
        } else {
          return 'admin-page-backgroud';
        }
        break;
      case 'list':
        if (this.user.status === this.userStatusEnum.NO_BUSINESS) {
          return 'text-white';
        } else {
          return 'text-black';
        }
        break;
      default:
        break;
    }
  }
}
