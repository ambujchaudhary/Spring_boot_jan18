import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChargebeeUtilsService {

  public cbInstance;

  constructor() { }

  public connectToChargebee() {
    if (typeof window !== 'undefined' && typeof window['Chargebee'] !== 'undefined') {

      this.cbInstance = window['Chargebee'].init({
        site: environment.chargebeeHost
      });

      return this.cbInstance;
    }
  }

  public getFormUrlEncoded(toConvert) {
    const formBody = [];

    for (const property in toConvert) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(toConvert[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
  }
}
