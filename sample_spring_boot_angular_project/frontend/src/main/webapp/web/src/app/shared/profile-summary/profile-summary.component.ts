import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { PrivateUserProfileData, PublicUserProfileData } from '../../admin/admin.model';
import { ValidationService } from '../../utils/validation.service';

@Component({
  selector: 'zu-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss']
})
export class ProfileSummaryComponent implements OnInit, OnChanges {
  @Input() profile: PublicUserProfileData | PrivateUserProfileData;
  @Input() showAccordion = false;
  @Input() open = false;
  @Input() offset = 0;

  public isAccordion: boolean;

  constructor(private validationService: ValidationService) {
  }

  ngOnInit() {
    this.isAccordion = this.isHiddenAccordion();
  }

  ngOnChanges() {
    this.isAccordion = this.isHiddenAccordion();
  }

  private isHiddenAccordion(): boolean {
    if (typeof this.profile !== 'undefined' && this.profile.publicBio) {
      return this.validationService.isWordsLessThan(this.profile.publicBio, 50) === false;
    }
  }

  public setUserAvatar(): Object {
    const stylesObject = {};

    if (typeof this.profile !== 'undefined' && this.profile.profilePhoto) {
      stylesObject['background-image'] = `url(${this.profile.profilePhoto})`;
    }

    return stylesObject;
  }

  public getFullUserName(): string {
    if (this.profile) {
      const {firstName, lastName} = this.profile;

      return firstName ? `${firstName} ${lastName}` : '';
    }

    return '';
  }

  public getUserExperience(): string {
    if (this.profile) {
      const {experience} = this.profile;

      return experience ? `${experience} of experience` : '';
    }

    return '';
  }
}
