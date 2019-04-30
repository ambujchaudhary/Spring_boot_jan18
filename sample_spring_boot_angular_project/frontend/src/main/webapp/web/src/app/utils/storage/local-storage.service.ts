import { Injectable } from '@angular/core';

export type LocalStorageKey =
    'country'
    | 'authToken'
    | 'weather'
    | 'feedbackModalData'
    | 'preExpireJobModalData'
    | 'autocompleteModalData'
    | 'offerTransactionComplete'
    | 'socialUser';

@Injectable({providedIn: 'root'})
export class LocalStorageService {

  constructor() { }

  public get(key: LocalStorageKey): string | undefined {
    const _value = localStorage.getItem(key);

    return _value;
  }

  public getObject<T>(key: LocalStorageKey): T {
    const _value = localStorage.getItem(key);
    const parsedValue = JSON.parse(_value);

    return parsedValue;
  }

  public set(key: LocalStorageKey, value: string) {
    localStorage.setItem(key, value);
  }

  public setObject<T>(key: LocalStorageKey, value: T) {
    const _value = JSON.stringify(value);

    localStorage.setItem(key, _value);
  }

  public delete(key: LocalStorageKey) {
    localStorage.removeItem(key);
  }

}
