import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zu-renew-job-modal',
  templateUrl: './renew-job-modal.component.html',
  styleUrls: ['./renew-job-modal.component.scss']
})
export class RenewJobModalComponent implements OnInit {

  public description = 'This action will keep your job active for a further 30 days.';

  constructor() { }

  ngOnInit() {
  }

}
