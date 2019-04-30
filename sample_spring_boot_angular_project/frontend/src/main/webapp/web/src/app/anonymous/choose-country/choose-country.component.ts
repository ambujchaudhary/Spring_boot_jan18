import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/typings/autocomplete';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { CallbackHandlerService } from '../../utils/callback-handler.service';

import { LocalStorageService } from '../../utils/storage/local-storage.service';
import { MessagesService } from '../../utils/messages.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { ValidationService } from '../../utils/validation.service';
import { ChooseCountryStep, Country } from './choose-country.model';
import { ChooseCountryService } from './choose-country.service';

// import * as countriesJSON from './countries.json';

// TODO move to file
const EMAIL_REGEX = /\S+@\S+\.\S+/;
const NAME_REGEX = /^[a-z ,.'-]+$/i;

@Component({
  selector: 'zu-choose-country',
  templateUrl: './choose-country.component.html',
  styleUrls: ['./choose-country.component.scss'],
})
export class ChooseCountryComponent implements OnInit, AfterViewInit {

  public countryInputCtrl = new FormControl();
  public filteredCountries: Observable<Country[]>;

  public countries: Country[];
  public chosenCountry: string;
  public activeStep: ChooseCountryStep;
  public subscribeForm: FormGroup;

  private supportedCountries = ['AU'];

  constructor(
      private router: Router,
      private localStorageService: LocalStorageService,
      private toaster: ToasterConfigService,
      private callbackService: CallbackHandlerService,
      private validationService: ValidationService,
      private messagesService: MessagesService,
      private chooseCountryService: ChooseCountryService
  ) {
  }

  ngOnInit() {
    this.localStorageService.delete('authToken');

    //    const _countries = (<any>countriesJSON);
    let _countries: any;

    _countries = {
      AD: 'Andorra',
      AE: 'United Arab Emirates',
      AF: 'Afghanistan',
      AG: 'Antigua and Barbuda',
      AI: 'Anguilla',
      AL: 'Albania',
      AM: 'Armenia',
      AN: 'Netherlands Antilles',
      AO: 'Angola',
      AQ: 'Antarctica',
      AR: 'Argentina',
      AS: 'American Samoa',
      AT: 'Austria',
      AU: 'Australia',
      AW: 'Aruba',
      AX: '\u00c5land Islands',
      AZ: 'Azerbaijan',
      BA: 'Bosnia and Herzegovina',
      BB: 'Barbados',
      BD: 'Bangladesh',
      BE: 'Belgium',
      BF: 'Burkina Faso',
      BG: 'Bulgaria',
      BH: 'Bahrain',
      BI: 'Burundi',
      BJ: 'Benin',
      BL: 'Saint Barthélemy',
      BM: 'Bermuda',
      BN: 'Brunei Darussalam',
      BO: 'Bolivia, Plurinational State of',
      BQ: 'Caribbean Netherlands',
      BR: 'Brazil',
      BS: 'Bahamas',
      BT: 'Bhutan',
      BV: 'Bouvet Island',
      BW: 'Botswana',
      BY: 'Belarus',
      BZ: 'Belize',
      CA: 'Canada',
      CC: 'Cocos (Keeling) Islands',
      CD: 'Congo, the Democratic Republic of the',
      CF: 'Central African Republic',
      CG: 'Congo',
      CH: 'Switzerland',
      CI: 'C\u00f4te d\'Ivoire',
      CK: 'Cook Islands',
      CL: 'Chile',
      CM: 'Cameroon',
      CN: 'China',
      CO: 'Colombia',
      CR: 'Costa Rica',
      CU: 'Cuba',
      CV: 'Cape Verde',
      CW: 'Cura\u00e7ao',
      CX: 'Christmas Island',
      CY: 'Cyprus',
      CZ: 'Czech Republic',
      DE: 'Germany',
      DJ: 'Djibouti',
      DK: 'Denmark',
      DM: 'Dominica',
      DO: 'Dominican Republic',
      DZ: 'Algeria',
      EC: 'Ecuador',
      EE: 'Estonia',
      EG: 'Egypt',
      EH: 'Western Sahara',
      ER: 'Eritrea',
      ES: 'Spain',
      ET: 'Ethiopia',
      EU: 'Europe',
      FI: 'Finland',
      FJ: 'Fiji',
      FK: 'Falkland Islands (Malvinas)',
      FM: 'Micronesia, Federated States of',
      FO: 'Faroe Islands',
      FR: 'France',
      GA: 'Gabon',
      'GB-ENG': 'England',
      'GB-NIR': 'Northern Ireland',
      'GB-SCT': 'Scotland',
      'GB-WLS': 'Wales',
      GB: 'United Kingdom',
      GD: 'Grenada',
      GE: 'Georgia',
      GF: 'French Guiana',
      GG: 'Guernsey',
      GH: 'Ghana',
      GI: 'Gibraltar',
      GL: 'Greenland',
      GM: 'Gambia',
      GN: 'Guinea',
      GP: 'Guadeloupe',
      GQ: 'Equatorial Guinea',
      GR: 'Greece',
      GS: 'South Georgia and the South Sandwich Islands',
      GT: 'Guatemala',
      GU: 'Guam',
      GW: 'Guinea-Bissau',
      GY: 'Guyana',
      HK: 'Hong Kong',
      HM: 'Heard Island and McDonald Islands',
      HN: 'Honduras',
      HR: 'Croatia',
      HT: 'Haiti',
      HU: 'Hungary',
      ID: 'Indonesia',
      IE: 'Ireland',
      IL: 'Israel',
      IM: 'Isle of Man',
      IN: 'India',
      IO: 'British Indian Ocean Territory',
      IQ: 'Iraq',
      IR: 'Iran, Islamic Republic of',
      IS: 'Iceland',
      IT: 'Italy',
      JE: 'Jersey',
      JM: 'Jamaica',
      JO: 'Jordan',
      JP: 'Japan',
      KE: 'Kenya',
      KG: 'Kyrgyzstan',
      KH: 'Cambodia',
      KI: 'Kiribati',
      KM: 'Comoros',
      KN: 'Saint Kitts and Nevis',
      KP: 'Korea, Democratic People\'s Republic of',
      KR: 'Korea, Republic of',
      KW: 'Kuwait',
      KY: 'Cayman Islands',
      KZ: 'Kazakhstan',
      LA: 'Lao People\'s Democratic Republic',
      LB: 'Lebanon',
      LC: 'Saint Lucia',
      LI: 'Liechtenstein',
      LK: 'Sri Lanka',
      LR: 'Liberia',
      LS: 'Lesotho',
      LT: 'Lithuania',
      LU: 'Luxembourg',
      LV: 'Latvia',
      LY: 'Libya',
      MA: 'Morocco',
      MC: 'Monaco',
      MD: 'Moldova, Republic of',
      ME: 'Montenegro',
      MF: 'Saint Martin',
      MG: 'Madagascar',
      MH: 'Marshall Islands',
      MK: 'Macedonia, the former Yugoslav Republic of',
      ML: 'Mali',
      MM: 'Myanmar',
      MN: 'Mongolia',
      MO: 'Macao',
      MP: 'Northern Mariana Islands',
      MQ: 'Martinique',
      MR: 'Mauritania',
      MS: 'Montserrat',
      MT: 'Malta',
      MU: 'Mauritius',
      MV: 'Maldives',
      MW: 'Malawi',
      MX: 'Mexico',
      MY: 'Malaysia',
      MZ: 'Mozambique',
      NA: 'Namibia',
      NC: 'New Caledonia',
      NE: 'Niger',
      NF: 'Norfolk Island',
      NG: 'Nigeria',
      NI: 'Nicaragua',
      NL: 'Netherlands',
      NO: 'Norway',
      NP: 'Nepal',
      NR: 'Nauru',
      NU: 'Niue',
      NZ: 'New Zealand',
      OM: 'Oman',
      PA: 'Panama',
      PE: 'Peru',
      PF: 'French Polynesia',
      PG: 'Papua New Guinea',
      PH: 'Philippines',
      PK: 'Pakistan',
      PL: 'Poland',
      PM: 'Saint Pierre and Miquelon',
      PN: 'Pitcairn',
      PR: 'Puerto Rico',
      PS: 'Palestine',
      PT: 'Portugal',
      PW: 'Palau',
      PY: 'Paraguay',
      QA: 'Qatar',
      RE: 'Réunion',
      RO: 'Romania',
      RS: 'Serbia',
      RU: 'Russian Federation',
      RW: 'Rwanda',
      SA: 'Saudi Arabia',
      SB: 'Solomon Islands',
      SC: 'Seychelles',
      SD: 'Sudan',
      SE: 'Sweden',
      SG: 'Singapore',
      SH: 'Saint Helena, Ascension and Tristan da Cunha',
      SI: 'Slovenia',
      SJ: 'Svalbard and Jan Mayen Islands',
      SK: 'Slovakia',
      SL: 'Sierra Leone',
      SM: 'San Marino',
      SN: 'Senegal',
      SO: 'Somalia',
      SR: 'Suriname',
      SS: 'South Sudan',
      ST: 'Sao Tome and Principe',
      SV: 'El Salvador',
      SX: 'Sint Maarten (Dutch part)',
      SY: 'Syrian Arab Republic',
      SZ: 'Swaziland',
      TC: 'Turks and Caicos Islands',
      TD: 'Chad',
      TF: 'French Southern Territories',
      TG: 'Togo',
      TH: 'Thailand',
      TJ: 'Tajikistan',
      TK: 'Tokelau',
      TL: 'Timor-Leste',
      TM: 'Turkmenistan',
      TN: 'Tunisia',
      TO: 'Tonga',
      TR: 'Turkey',
      TT: 'Trinidad and Tobago',
      TV: 'Tuvalu',
      TW: 'Taiwan',
      TZ: 'Tanzania, United Republic of',
      UA: 'Ukraine',
      UG: 'Uganda',
      UM: 'US Minor Outlying Islands',
      US: 'United States',
      UY: 'Uruguay',
      UZ: 'Uzbekistan',
      VA: 'Holy See (Vatican City State)',
      VC: 'Saint Vincent and the Grenadines',
      VE: 'Venezuela, Bolivarian Republic of',
      VG: 'Virgin Islands, British',
      VI: 'Virgin Islands, U.S.',
      VN: 'Viet Nam',
      VU: 'Vanuatu',
      WF: 'Wallis and Futuna Islands',
      XK: 'Kosovo',
      WS: 'Samoa',
      YE: 'Yemen',
      YT: 'Mayotte',
      ZA: 'South Africa',
      ZM: 'Zambia',
      ZW: 'Zimbabwe'
    };

    this.countries = this.transformCountriesJSON(_countries);
    this.filteredCountries = this.countryInputCtrl.valueChanges
    .pipe(
        startWith(''),
        map((state) => state ? this._filterStates(state) : this.countries.slice())
    );

    this.activeStep = 0;

    const country = this.localStorageService.get('country');

    this.chosenCountry = (country || '').length > 0 ? country : '';

    this.countryInputCtrl.setValue(this.getChosenCountry('label'));

    this.subscribeForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(NAME_REGEX)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(NAME_REGEX)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
    });
  }

  ngAfterViewInit() {}

  private transformCountriesJSON(objectList: string[]): Country[] {
    //    const allCountry = objectList['default'];

    const keys = Object.keys(objectList);

    const iconPath = '../../../assets/images/country-flags/png100px';
    const iconExt = 'png';

    const result = keys.reduce(
        (arr, key: string) => {
          let tmpItem: Country;

          if (key !== 'default') {
            tmpItem = {
              code: key,
              label: objectList[key],
              icon: `${iconPath}/${key.toLocaleLowerCase()}.${iconExt}`
            };

            arr.push(tmpItem);
          }

          return arr;
        },
        [] as Country[]);

    result.sort(function(a, b) {
      const keyA = a.label;
      const keyB = b.label;

      if (keyA < keyB) {
        return -1;
      } else if (keyA > keyB) {
        return 1;
      } else {
        return 0;
      }
    });

    return result;
  }

  public checkSupportedCountry(): void {

    this.toaster.hide();

    if (this.validationService.isStringNotEmpty(this.chosenCountry) === false || this.isCountryExistsInList() === false) {
      this.messagesService.showError('choose_your_country.message.empty_country');
      return;
    }

    const isSupportedCountry = this.supportedCountries.some((code: string) => code === this.chosenCountry);

    if (isSupportedCountry) {
      this.localStorageService.set('country', this.chosenCountry);
      this.router.navigate(['/login']);
    } else {
      this.localStorageService.delete('country');
      this.scrollToTop();
      this.activeStep = 1;
    }

  }

  public selectCountry(event: MatAutocompleteSelectedEvent): void {
    const _shosenCountryData = this.countries.find((country) => country.label === event.option.value);
    this.chosenCountry = _shosenCountryData.code;
  }

  private isCountryExistsInList(): boolean {
    return this.countries.some((country) => country.label.toLowerCase() === this.countryInputCtrl.value.toLowerCase());
  }

  public autocompleteBlurHandler() {
    const value = this.countryInputCtrl.value || '';
    const chosenCountry = this.getChosenCountry() as Country;
    const label = chosenCountry.label || '';

    if (label.toLocaleLowerCase() === value) {
      this.countryInputCtrl.setValue(label);

    } else if (this.isCountryExistsInList()) {

      const typedCountry = this.countries.find((country) => country.label.toLowerCase() === value.toLowerCase());

      this.chosenCountry = typedCountry.code;
      this.countryInputCtrl.setValue(typedCountry.label);

    } else if (this.chosenCountry.length > 0 && !value) {
      this.chosenCountry = '';

    } else {
      const _countries = this._filterStates(value);
      const firstCountry = _countries.length > 0 ? _countries[0] : this.countries[0];
      this.chosenCountry = firstCountry.code;
      this.countryInputCtrl.setValue(firstCountry.label);
    }

  }

  public getChosenCountry(field?: 'icon' | 'label' | 'code'): Country | string {
    const countryDetails = this.countries.find((country) => country.code === this.chosenCountry) || {};

    return typeof field === 'string' ? (countryDetails || {})[field] : countryDetails;
  }

  public getChosenCountryFlag(): string {
    const icon = this.getChosenCountry('icon') as string;

    return icon ? 'url(' + icon + ')' : '';
  }

  public subscribe() {
    const {email = '', firstName = '', lastName = ''} = this.subscribeForm.value;
    const country = this.chosenCountry;

    this.toaster.hide();

    if (this.validationService.isSomeStringEmpty(email, firstName, lastName) === true) {
      this.messagesService.showError('common.all_fields_are_mandatory');
      return;
    }

    if (this.validationService.isEmailValid(email) === false) {
      this.messagesService.showError('common.email_is_invalid');
      return;
    }

    const saveData = {country, email, firstName, lastName};

    this.chooseCountryService.subscribe(saveData).subscribe(
        () => {
          this.scrollToTop();
          this.activeStep = 2;
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });
  }

  private _filterStates(value = ''): Country[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter((state: Country) => {
      return (state.label || '').toLowerCase().startsWith(filterValue) === true;
    });
  }

  public resetStep() {
    this.subscribeForm.reset();
    this.activeStep = 0;
    this.scrollToTop();
  }

  private scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  public setFlag(code: string): string {
    return code ? `flag-${code.toLowerCase()}` : '';
  }

  public goBack(): void {
    this.activeStep = 0;
  }
}
