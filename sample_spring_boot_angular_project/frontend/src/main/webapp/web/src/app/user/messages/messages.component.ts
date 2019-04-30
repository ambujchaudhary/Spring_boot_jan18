import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'zu-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @Input() isMobile = false;

  constructor() { }

  ngOnInit() {
  }

}
