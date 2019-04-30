import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zu-cancel-job-modal',
  templateUrl: './cancel-job-modal.component.html',
  styleUrls: ['./cancel-job-modal.component.scss']
})
export class CancelJobModalComponent implements OnInit {

  public description = 'This action will cancel your job and move it into archive';

  constructor() { }

  ngOnInit() {
  }

}
