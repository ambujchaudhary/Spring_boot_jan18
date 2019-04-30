import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { createNumberMask } from 'text-mask-addons/dist/textMaskAddons';
import { MathService } from '../../../utils/math.service';
import { InputChangeTypeEnum, InputTypeEnum } from './input.model';

/*
* Example:
*
* <zu-input
*     [type]="'number'"
*     [value]="'1'"
*     [step]="0.5"
*     [min]="1"
*     [max]="24">
*     (onChange)="changeHandler($event)"
* </zu-input>
*
* */

// See the Text Mask Addons docs for the meaning of these formats:
//  https://github.com/text-mask/text-mask/tree/master/addons#createnumbermask
const maskOptions = {
  currency: {
    prefix: '$',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: 6,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
  },
  number: {
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: 4,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
  },
};

@Component({
  selector: 'zu-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit, OnChanges {

  public readonly inputChangeTypeEnum = InputChangeTypeEnum;

  @Input() type: InputTypeEnum;
  @Input() value: string;
  @Input() step: number;
  @Input() min: number | undefined;
  @Input() max: number | undefined;
  @Input() column = true;
  @Input() small = false;
  @Input() placeholder: string;
  @Input() ableEmpty = false;

  @Output() onChange: EventEmitter<string> = new EventEmitter();

  public modelValue: string;

  // we use addons for mask:
  // https://github.com/text-mask/text-mask/tree/master/addons#masks
  // also you can use default mask:
  // https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#mask-function
  public mask: any;

  // https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#guide
  public guide: boolean;

  // https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#placeholderchar
  public placeholderChar: string;

  private maskType: any;
  private isMax: boolean;
  private isMin: boolean;

  private static convertToNumber(maskedValue: string, options: any, leftEmpty: boolean): number {
    let tmpValue = maskedValue;
    let result: number;

    tmpValue = tmpValue.replace(options.prefix, '').replace(options.suffix, '');

    if (options.includeThousandsSeparator === true) {
      tmpValue = tmpValue.replace(options.thousandsSeparatorSymbol, '');
    }

    if (options.allowDecimal === true) {
      tmpValue = tmpValue.replace(options.decimalSymbol, '.');
    }

    result = parseFloat(tmpValue);

    // return 0 or undefined if result is NaN
    if (result !== result) {
      return leftEmpty === true ? undefined : 0;
    } else {
      return result;
    }
  }

  private static setMaskDecimalSymbol(maskedValue: number, options: any): string {
    let tmpValue = maskedValue.toString();

    if (options.allowDecimal === true) {
      tmpValue = tmpValue.replace('.', options.decimalSymbol);
    }

    return tmpValue;
  }

  constructor(private mathService: MathService) { }

  ngOnInit() {
    this.initMaskByType(this.type);

    this.modelValue = this.value || '';

    this.isMax = typeof this.max === 'number';
    this.isMin = typeof this.min === 'number';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes.value === 'undefined') {
      return;
    }
    const {currentValue} = changes.value;

    if ((typeof currentValue === 'undefined' || typeof currentValue === 'string') && currentValue === currentValue) {
      this.modelValue = changes.value.currentValue || '';
    }
  }

  private initMaskByType(maskType: InputTypeEnum) {
    switch (maskType) {
      case InputTypeEnum.CURRENCY:
        this.maskType = maskOptions.currency;
        break;
      case InputTypeEnum.NUMBER:
      default:
        this.maskType = maskOptions.number;
    }

    // init text mask
    this.mask = createNumberMask(this.maskType);

    this.guide = false;
    this.placeholderChar = '\u2000';
  }

  public blurHandler() {

    const numberValue = InputComponent.convertToNumber(this.modelValue, this.maskType, this.ableEmpty);
    let nextValue: number | undefined;

    // check on NaN
    if (numberValue !== numberValue) {
      nextValue = this.ableEmpty === true ? 0 : undefined;
    } else {
      nextValue = numberValue;
    }

    if (this.ableEmpty === true && typeof nextValue === 'undefined') {
      this.emitChange(nextValue);
      this.modelValue = '';
    }

    if (this.isMin && nextValue < this.min) {
      nextValue = this.min;
    }

    if (nextValue !== numberValue) {
      this.emitChange(nextValue);

      this.modelValue = InputComponent.setMaskDecimalSymbol(nextValue, this.maskType);
    }
  }

  public changeHandler() {
    const cleanNumberValue = InputComponent.convertToNumber(this.modelValue, this.maskType, this.ableEmpty);

    this.emitChange(cleanNumberValue);
  }

  public changeValue(type: InputChangeTypeEnum) {
    const numberValue = InputComponent.convertToNumber(this.modelValue, this.maskType, this.ableEmpty);
    const nextValue = this.getNextValueByType(numberValue, type);
    const newValue = this.checkMinMaxValue(nextValue);

    this.modelValue = InputComponent.setMaskDecimalSymbol(newValue, this.maskType);
    this.emitChange(newValue);
  }

  private getNextValueByType(value: number, type: InputChangeTypeEnum): number {
    let result: number;

    switch (type) {
      case InputChangeTypeEnum.INCREMENT:
        result = this.mathService.addTwoDecimals(value, this.step);
        break;
      case InputChangeTypeEnum.DECREMENT:
        result = this.mathService.subtractTwoDecimals(value, this.step);
        break;
      default:
        result = value;
    }

    return result;
  }

  private checkMinMaxValue(value: number): number {
    let result: number;

    if (this.isMin && value < this.min) {
      result = this.min;
    } else if (this.isMax && value > this.max) {
      result = this.max;
    } else {
      result = value;
    }

    return result;
  }

  private emitChange(value: number | undefined) {
    const stringValue = typeof value === 'undefined' ? undefined : value.toString();

    this.onChange.emit(stringValue);
  }
}
