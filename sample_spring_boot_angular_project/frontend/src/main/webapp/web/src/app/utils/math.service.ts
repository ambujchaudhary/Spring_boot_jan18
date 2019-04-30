import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class MathService {

  constructor() { }

  public convertDecimalToInteger(number = 0, precision = 2) {
    const value = number.toFixed(precision + 1);
    const index = value.lastIndexOf('.') + precision;
    const result = value.replace('.', '').substr(0, index);
    return parseInt(result, 10);
  }

  public changePrecision(number = 0, precision = 2) {
    let result: number;

    const integer = this.convertDecimalToInteger(number, precision);

    result = integer / Math.pow(10, precision);

    return result;
  }

  public multiplyTwoDecimals(first: number, thecond: number, precision = 2): number {
    let result: number;

    const firstInteger = this.convertDecimalToInteger(first, precision);
    const thecondInteger = this.convertDecimalToInteger(thecond, precision);
    const multiplyResult = (firstInteger * thecondInteger);

    result = multiplyResult / Math.pow(10, precision * 2);

    return result;
  }

  public divideTwoDecimals(first: number, thecond: number, precision = 2): number {
    const firstInteger = this.convertDecimalToInteger(first, precision);
    const thecondInteger = this.convertDecimalToInteger(thecond, precision);
    const result = (firstInteger / thecondInteger);

    return result;
  }

  public addTwoDecimals(first: number, thecond: number, precision = 2): number {
    let result: number;

    const firstInteger = this.convertDecimalToInteger(first, precision);
    const thecondInteger = this.convertDecimalToInteger(thecond, precision);
    const multiplyResult = (firstInteger + thecondInteger);

    result = multiplyResult / Math.pow(10, precision);

    return result;
  }

  public subtractTwoDecimals(first: number, thecond: number, precision = 2): number {
    let result: number;

    const firstInteger = this.convertDecimalToInteger(first, precision);
    const thecondInteger = this.convertDecimalToInteger(thecond, precision);
    const multiplyResult = (firstInteger - thecondInteger);

    result = multiplyResult / Math.pow(10, precision);

    return result;
  }
}
