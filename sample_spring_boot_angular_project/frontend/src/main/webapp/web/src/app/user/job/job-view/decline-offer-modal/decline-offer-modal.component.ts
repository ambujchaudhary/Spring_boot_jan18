import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zu-decline-offer-modal',
  templateUrl: './decline-offer-modal.component.html',
  styleUrls: ['./decline-offer-modal.component.scss']
})
export class DeclineOfferModalComponent implements OnInit {

  public readonly description = 'You are about to decline this offer. If you proceed - you will be removed as an applicant, and the' +
                                ' position will be offered to another Zu Crew member.';

  constructor() { }

  ngOnInit() {
  }

}
