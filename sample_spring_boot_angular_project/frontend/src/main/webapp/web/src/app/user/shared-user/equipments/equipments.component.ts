import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { ChipsConfigService } from '../../../utils/chips-config.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { MessagesService } from '../../../utils/messages.service';

/*
* Example:
*
* <zu-equipments
*     [list]="['Canon', 'Nikon']"
*     [max]="moment('2050-06-26')"
*     (onChange)="onChangeHandler($event)">
* </zu-equipments>
*
* */

@Component({
  selector: 'zu-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss'],
})
export class EquipmentsComponent implements OnInit {

  @Input() list: string[];

  @Output() onChange: EventEmitter<string[]> = new EventEmitter();

  public chipsSeparatorKeysCodes = ChipsConfigService.separatorKeysCodes;
  public selectable = false;
  public removable = true;

  constructor(private toaster: ToasterConfigService,
              private messagesService: MessagesService) { }

  ngOnInit() {
    if (Array.isArray(this.list) === false) {
      this.list = [];
    }
  }

  /* Chips events */
  public addChips(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const newValue = value.trim();

    const isEquipmentAlreadyExist = this.list.some((aEquipment) => aEquipment === newValue);

    if (isEquipmentAlreadyExist === true) {
      return this.messagesService.showWarning('equipments.already_entered_that_equipment_type.massage_warning');
    }

    // Add new equipment
    if ((value || '').trim()) {
      const newList = [...this.list, newValue];
      this.onChange.emit(newList);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  public removeChips(item: any): void {
    const index = this.list.indexOf(item);

    if (index >= 0) {
      const newList = [...this.list];
      newList.splice(index, 1);
      this.onChange.emit(newList);
    }
  }

}
