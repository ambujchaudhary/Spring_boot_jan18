import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'zu-post-job-controls',
  templateUrl: './post-job-controls.component.html',
  styleUrls: ['./post-job-controls.component.scss'],
})
export class PostJobControlsComponent {

  @Input() step: 0 | 1;

  @Output() onBack: EventEmitter<any> = new EventEmitter();
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Input() isTermsNotAccepted = true;
  @Input() isRequestInProgress = false;

  private jobId = this.route.snapshot.params['id'];

  constructor(private route: ActivatedRoute) { }

  public backHandler() {
    this.onBack.emit();
  }

  public nextHandler() {
    this.onNext.emit();
  }

  public submitHandler() {
    this.onSubmit.emit();
  }

  public setButtonText() {
    if (typeof this.jobId !== 'undefined') {
      return 'Update job';
    }

    if (typeof this.jobId === 'undefined') {
      return 'Post job';
    }
  }
}
