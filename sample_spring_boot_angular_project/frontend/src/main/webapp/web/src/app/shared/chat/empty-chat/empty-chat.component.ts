import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'zu-empty-chat',
  templateUrl: './empty-chat.component.html',
  styleUrls: ['./empty-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
