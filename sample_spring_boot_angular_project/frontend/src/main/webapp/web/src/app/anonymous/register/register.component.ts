import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, Injector, Input, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { environment } from '../../../../../environments/environment';
import { UserStatus } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { BrowserServiceProvider } from '../../utils/browser.service';
import { ChargebeeUtilsService } from '../../utils/chargebee-utils.service';
import { MessagesService } from '../../utils/messages.service';
import { LocalStorageService } from '../../utils/storage/local-storage.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { ValidationService } from '../../utils/validation.service';
import { AnonymousService } from '../anonymous.service';
import {
  RegisterTypes,
  SignUpFormData,
  RegisterSteps,
  SignUpWithSocialFormData,
  MembershipTypeEnum, ChargbeeSubscriptionData, SocialUser
} from '../anonymous.model';
import { CallbackHandlerService } from '../../utils/callback-handler.service';

// TODO move to file
const EMAIL_REGEX = /\S+@\S+\.\S+/;
const NAME_REGEX = /^[a-z ,.'-]+$/i;

declare const Chargebee: any;

@Component({
  selector: 'zu-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss'],
})

export class RegisterComponent implements OnInit, AfterViewInit {

  @Input() mobile = false;

  public isMobile: boolean;
  public readonly userStatus = UserStatus;
  public readonly membershipTypeEnum = MembershipTypeEnum;

  readonly RegisterSteps = RegisterSteps;

  // FIXME set correct type instead any
  public registrationForm: any;
  public activeStep = 0;

  public termsOfUse = false;
  public privacyPolicy = false;
  public isRequestInProgress: boolean;

  private registerType: RegisterTypes;
  public steps: RegisterSteps[];

  private platform: Platform;
  private browserService: BrowserServiceProvider;

  public membershipType: MembershipTypeEnum;
  public disabledClass: string;

  public cbInstance;
  private prefix = '/api/protected';
  private subscriptionId: ChargbeeSubscriptionData;

  private static getRequestParamsForSignUpWithotEmail(dataForRequest: SignUpFormData): SignUpWithSocialFormData {
    const {
      emailSocial,
    } = dataForRequest;

    const signUpWithSocial = new SignUpWithSocialFormData();

    signUpWithSocial.email = emailSocial;

    return signUpWithSocial;
  }

  // Check password for minimum required length
  private static isPasswordShort(passwordValue = ''): boolean {
    const minPasswordLength = 6;

    return passwordValue.length >= minPasswordLength;
  }

  // Check passwords identity
  private static isPasswordSame(password = '', confirmPassword = ''): boolean {
    return password === confirmPassword;
  }

  constructor(
      private anonymousService: AnonymousService,
      protected route: ActivatedRoute,
      private toaster: ToasterConfigService,
      private callbackService: CallbackHandlerService,
      private validationService: ValidationService,
      private messagesService: MessagesService,
      private localStorageService: LocalStorageService,
      private injector: Injector,
      private router: Router,
      private authService: AuthService,
      private httpClient: HttpClient,
      private zone: NgZone,
      private chargebeeService: ChargebeeUtilsService
  ) {

    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }

    try {
      this.browserService = injector.get(BrowserServiceProvider);
    } catch (e) {
    }

    try {
      if (this.platform.is('mobile')) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    } catch (e) {
      this.isMobile = false;
    }
  }

  ngOnInit() {
    this.isMobile = this.mobile === true;

    this.initRegisterType();
    this.initRegisterSteps();
    this.initRegistrationForm();

    this.saveAuthToken();

    this.reloadMobile();

    this.cbInstance = this.chargebeeService.connectToChargebee();
    this.subscriptionId = new ChargbeeSubscriptionData();
  }

  ngAfterViewInit(): void {
    Chargebee.registerAgain();
  }

  public openCheckoutInBrowser(): void {
    this.browserService.openBrowser(environment.baseUrl + '/login');
  }

  private initRegisterSteps() {
    const defaultSteps = [RegisterSteps.USER_DATA, RegisterSteps.TERMS_AND_POLICY, RegisterSteps.SELECT_MEMBERSHIP];
    const socialSteps = [RegisterSteps.TERMS_AND_POLICY, RegisterSteps.SELECT_MEMBERSHIP];
    const chargeBeeSteps = [RegisterSteps.TERMS_AND_POLICY, RegisterSteps.SELECT_MEMBERSHIP];
    const facebookWithoutEmailSteps = [RegisterSteps.USER_EMAIL, RegisterSteps.TERMS_AND_POLICY, RegisterSteps.SELECT_MEMBERSHIP];

    const tmpRegisterType = this.route.snapshot.params['type'];

    switch (tmpRegisterType) {
      case RegisterTypes.SOCIAL_WITHOUT_EMAIL:
        this.steps = [...facebookWithoutEmailSteps];
        break;
      case RegisterTypes.SOCIAL:
        this.steps = [...socialSteps];
        break;
      case RegisterTypes.CHARGEBEE:
        this.steps = [...chargeBeeSteps];
        break;
      default:
        this.steps = [...defaultSteps];
    }

  }

  private initRegisterType(): void {
    const tmpRegisterType = this.route.snapshot.params['type'];

    switch (tmpRegisterType) {
      case RegisterTypes.SOCIAL:
        this.registerType = RegisterTypes.SOCIAL;
        break;
      case RegisterTypes.CHARGEBEE:
        this.registerType = RegisterTypes.CHARGEBEE;
        break;
      case RegisterTypes.SOCIAL_WITHOUT_EMAIL:
        this.registerType = RegisterTypes.SOCIAL_WITHOUT_EMAIL;
        break;
      default:
        this.registerType = RegisterTypes.DEFAULT;
    }
  }

  private initRegistrationForm() {
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(NAME_REGEX)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(NAME_REGEX)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      emailSocial: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
    });
  }

  public registration(): void {
    // Validation of sign-up form on Credit Card step

    const errorMessageAppear = this.beforeGoToNextStepHook(this.activeStep);

    if (errorMessageAppear.length > 0) {
      this.toaster.error(errorMessageAppear);
      return;
    }

    switch (this.registerType) {
      case RegisterTypes.SOCIAL:
        this.signUpWithSocial(this.registrationForm.value);
        break;
      case RegisterTypes.SOCIAL_WITHOUT_EMAIL:
        const facebookUser = this.localStorageService.getObject<SocialUser>('socialUser');
        facebookUser.email = this.registrationForm.get('emailSocial').value;
        this.authSocialWithoutEmail(facebookUser);
        break;
      default:
        this.signUp(this.registrationForm.value);
    }
  }

  private signUp(formData: SignUpFormData): void {
    this.isRequestInProgress = true;
    this.anonymousService.signUp(formData)
    .finally(() => {
      this.isRequestInProgress = false;
    })
    .subscribe(
        (data) => {
          this.localStorageService.set('authToken', data.token);
          this.goToNextStep();
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        }
    );
  }

  private saveAuthToken(): void {
    if (this.route.snapshot.queryParams['t']) {
      this.localStorageService.set('authToken', this.route.snapshot.queryParams['t']);
      this.router.navigate(['/']);
    }
  }

  private signUpWithSocial(formData: SignUpFormData, isEmail = false): void {
    let signUpWithSocial: SignUpWithSocialFormData;

    signUpWithSocial = RegisterComponent.getRequestParamsForSignUpWithotEmail(formData);

    this.anonymousService.signUpWithSocial(signUpWithSocial).subscribe(
        () => {
          this.goToNextStep();
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        }
    );
  }

  private authSocialWithoutEmail(userFacebook: SocialUser): void {
    this.zone.run(
        () => {
          this.anonymousService.authWithFacebook(userFacebook).subscribe(
              (data) => {
                this.localStorageService.set('authToken', data.token);
                this.localStorageService.delete('socialUser');

                this.activeStep = 1;
              },
              (error) => {
                this.toaster.error(this.callbackService.getErrorMessage(error));
              }
          );
        });
  }

  public goToPreviousStep(): void {
    this.activeStep = this.activeStep > 0 ? this.activeStep - 1 : 0;
  }

  public goToNextStep(): void {

    // Validation of sign-up form on User Data step and User Email step

    const errorMessageAppear = this.beforeGoToNextStepHook(this.activeStep);
    if (errorMessageAppear.length > 0) {
      this.toaster.error(errorMessageAppear);
    } else {
      this.activeStep = this.activeStep + 1;
    }

  }

  private beforeGoToNextStepHook(currentStep: number): string {
    const formData = this.registrationForm.value;
    let errorMessage = '';

    if (this.steps[currentStep] === RegisterSteps.USER_DATA) {
      if (this.isAllFieldFill(formData) === false) {
        errorMessage = this.messagesService.get('common.all_fields_are_mandatory');
      } else if (RegisterComponent.isPasswordShort(formData.password) === false) {
        errorMessage = this.messagesService.get('register.password_short');
      } else if (RegisterComponent.isPasswordSame(formData.password, formData.confirmPassword) === false) {
        errorMessage = this.messagesService.get('register.password_not_match');
      } else if (this.registrationForm.get('email').hasError('pattern')) {
        errorMessage = this.messagesService.get('common.email_is_invalid');
      } else if (this.registrationForm.get('firstName').hasError('pattern')) {
        errorMessage = this.messagesService.get('register.incorrect_first_name');
      } else if (this.registrationForm.get('lastName').hasError('pattern')) {
        errorMessage = this.messagesService.get('register.incorrect_last_name');
      }
    }

    if (this.steps[currentStep] === RegisterSteps.USER_EMAIL) {
      if (this.registrationForm.get('emailSocial').hasError('pattern')) {
        errorMessage = this.messagesService.get('common.email_is_invalid');
      } else if (this.registrationForm.get('emailSocial').hasError('required')) {
        errorMessage = this.messagesService.get('common.email_is_mandatory');
      }
    }

    if (this.steps[currentStep] === RegisterSteps.TERMS_AND_POLICY) {
      // Check terms of privacy agreed
      if (this.isAgreeWithTermsAndPrivacy(this.termsOfUse, this.privacyPolicy) === false) {
        errorMessage = this.messagesService.get('register.terms_of_use_or_privacy_policy_is_invalid');
      }
    }

    return errorMessage;
  }

  public isAgreeWithTermsAndPrivacy(termsOfUse: boolean, privacyPolicy: boolean): boolean {
    return termsOfUse === true && privacyPolicy === true;
  }

  // Check all fields from sign-up User Data step for empty
  private isAllFieldFill(registrationFormData: SignUpFormData): boolean {
    const {firstName, lastName, email, password, confirmPassword} = registrationFormData;

    return this.validationService.isSomeStringEmpty(firstName, lastName, password, confirmPassword, email) === false;
  }

  private reloadMobile(): void {
    const int = setInterval(
        () => {
          if (this.steps[this.activeStep] === RegisterSteps.TERMS_AND_POLICY && this.isMobile === true) {

            this.authService.getUser().subscribe(
                (data) => {
                  if (data.status === this.userStatus.NO_BUSINESS) {
                    clearInterval(int);
                    this.router.navigate(['/']);
                  }
                }
            );

          }
        }, 5000
    );
  }

  // ChargeBee membership selection below

  public selectMembershipType(membershipType: MembershipTypeEnum): void {
    this.membershipType = membershipType;

    switch (this.membershipType) {
      case this.membershipTypeEnum.FREE:
        this.disabledClass = 'mouse-events-disabled';
        this.anonymousService.createNewFreeSubscription()
        .subscribe(
            () => {
              this.messagesService.showSuccess('register.chargebee_connection.message_success');
              this.router.navigate(['/business-profile']);
            },
            () => {
              this.disabledClass = '';
              this.messagesService.showError('common.message_error');
            }
        );
        break;
      case this.membershipTypeEnum.MONTHLY:
        this.openCheckout(this.membershipTypeEnum.MONTHLY);
        break;
      case this.membershipTypeEnum.ANNUAL:
        this.openCheckout(this.membershipTypeEnum.ANNUAL);
        break;
      default:
        return;
    }
  }

  private openCheckout(id: MembershipTypeEnum): void {

    this.cbInstance.logout();
    this.cbInstance.openCheckout({
      hostedPage: () => {
        return this.httpClient.post(
            `${this.prefix}/subscriptions/checkout/new`,
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
          this.disabledClass = 'mouse-events-disabled';
          this.subscriptionId.hostedPageId = hostedPageId;
        });
      }
    });
  }

  private SendHostedId(): void {
    if (this.subscriptionId.hostedPageId !== '') {
      this.anonymousService.createChargebeeSubscription(this.subscriptionId).subscribe(
          () => {
            this.messagesService.showSuccess('register.chargebee_connection.message_success');
            this.router.navigate(['/business-profile']);
          },
          () => {
            this.messagesService.showError('common.message_error');
          }
      );
    }
  }
}
