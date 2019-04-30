import { Component, Input } from '@angular/core';

@Component({
  selector: 'zu-equipments-preview',
  templateUrl: './equipments-preview.component.html',
  styleUrls: ['./equipments-preview.component.scss'],
})
export class EquipmentsPreviewComponent {

  @Input() equipment: string[] = [];

  constructor() { }

}
