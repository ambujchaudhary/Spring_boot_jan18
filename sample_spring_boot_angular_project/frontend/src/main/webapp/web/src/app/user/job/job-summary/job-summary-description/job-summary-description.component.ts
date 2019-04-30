import { Component, Input } from '@angular/core';

@Component({
  selector: 'zu-job-summary-description',
  templateUrl: './job-summary-description.component.html',
  styleUrls: ['./job-summary-description.component.scss']
})
export class JobSummaryDescriptionComponent {

  @Input() description: string;
  @Input() applicants: string;
  @Input() hideApplicants: boolean;
  @Input() id: number;

  public setDescription() {
    const maxDescriptionLength = 300;

    if (this.description.length <= maxDescriptionLength) {
      return this.description;
    }

    if (this.description.length > maxDescriptionLength) {
      return this.description.slice(0, maxDescriptionLength).concat('...');
    }
  }
}
