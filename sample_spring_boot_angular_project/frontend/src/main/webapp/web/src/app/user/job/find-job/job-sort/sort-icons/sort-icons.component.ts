import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'zu-sort-icons',
  templateUrl: './sort-icons.component.html',
  styleUrls: ['./sort-icons.component.scss']
})
export class SortIconsComponent implements OnInit {

  @Input() key: boolean;
  @Input() arrow: boolean;
  @Input() activeByDefault: boolean;

  constructor() { }

  ngOnInit() {
  }
}
