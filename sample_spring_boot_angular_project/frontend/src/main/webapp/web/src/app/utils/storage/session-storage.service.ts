import { Injectable } from '@angular/core';

type LocalStorageKey = 'user';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  public get(key: LocalStorageKey): string | undefined {
    const _value = sessionStorage.getItem(key);

    return _value;
  }

  public getObject<T>(key: LocalStorageKey): T {
    const _value = sessionStorage.getItem(key);
    const parsedValue = JSON.parse(_value);

    return parsedValue;
  }

  public set(key: LocalStorageKey, value: string) {
    sessionStorage.setItem(key, value);
  }

  public setObject<T>(key: LocalStorageKey, value: T) {
    const _value = JSON.stringify(value);

    sessionStorage.setItem(key, _value);
  }

  public delete(key: LocalStorageKey) {
    sessionStorage.removeItem(key);
  }
}
