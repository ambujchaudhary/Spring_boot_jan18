import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { OwnershipTypeEnum } from '../../user/job/job.model';
import { ValidationService } from '../../utils/validation.service';

@Component({
  selector: 'zu-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, OnChanges {

  @Input() title = '';
  @Input() additionalInfo = '';
  @Input() roles: string[] = [];
  @Input() location = '';
  @Input() description = '';
  @Input() showAccordion = false;
  @Input() ownershipType: OwnershipTypeEnum;
  @Input() ownerId: number;

  public isAccordion: boolean;
  public OwnershipTypeEnum = OwnershipTypeEnum;

  constructor(private validationService: ValidationService) {
  }

  ngOnInit() {
    this.isAccordion = this.isHiddenAccordion();
  }

  ngOnChanges() {
    this.isAccordion = this.isHiddenAccordion();
  }

  private isHiddenAccordion(): boolean {
    return this.validationService.isWordsLessThan(this.description, 50) === false;
  }

  public getOwnerProfileLink(): string {
    if (this.ownershipType === this.OwnershipTypeEnum.ADMIN) {
      return `/admin/user-profile/${this.ownerId}`;
    } else return `/profile/${this.ownerId}`;
  }
}
