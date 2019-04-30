import { Component, OnInit, Input } from '@angular/core';
import { PrivateUserProfileData, PublicUserProfileData } from '../../admin/admin.model';

@Component({
  selector: 'zu-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  @Input() profile: PublicUserProfileData | PrivateUserProfileData;
  @Input() showPrivateData = false;

  constructor() { }

  ngOnInit() {
  }

  public getCorrectLink(link: string): string {
    if (typeof link !== 'undefined' && link !== null) {
      if (link.startsWith('http') === false) {
        return `//${link}`;
      } else {
        return link;
      }
    }
  }
}
