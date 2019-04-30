import { Injectable } from '@angular/core';

// TODO
const EMAIL_REGEX = /\S+@\S+\.\S+/;

@Injectable({providedIn: 'root'})
export class ValidationService {

  constructor() { }

  public isStringNotEmpty(value: string): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  public isSomeStringEmpty(...rest: string[]): boolean {
    return rest.some((value) => this.isStringNotEmpty(value) === false);
  }

  public isArrayNotEmpty(value: any): boolean {
    return Array.isArray(value) && value.length > 0;
  }

  public isWordsLessThan(value: string, words = 50): boolean {
    const isNotEmpty = this.isStringNotEmpty(value);

    if (isNotEmpty === false) {
      return true;
    }

    const charactersArr = value.split(' ');
    const wordsArr = charactersArr.filter((character) => this.isStringNotEmpty(character));

    return wordsArr.length < words;
  }

  public isFileSizeLessMb(file: File, mb: number): boolean {
    // Upload file size should be less than 5Mb
    let result: boolean;

    result = ((file.size / 1024) <= mb * 1000);

    return result;
  }

  /*
  * Example:
  *
  * isAcceptedFileExtension('some-image.jpeg', '.jpg,.jpeg,.pdf');
  *
  * fileName: some-image.jpeg
  * acceptExtension: '.jpg,.jpeg,.pdf'
  *
  * */
  public isAcceptedFileExtension(fileName = '', acceptExtension = ''): boolean {
    let result: boolean;

    const fileExt = fileName.substr(fileName.lastIndexOf('.'));
    const extensionArr = acceptExtension.split(',') || [];

    result = extensionArr.includes(fileExt);

    return result;
  }

  isEmailValid(value = ''): boolean {
    const re = EMAIL_REGEX;
    return re.test(String(value).toLowerCase());
  }

  public isURLValid(value: string, pattern: RegExp): boolean {
    const testingValue = value || '';
    return pattern.test(String(testingValue).toLowerCase());
  }

}
