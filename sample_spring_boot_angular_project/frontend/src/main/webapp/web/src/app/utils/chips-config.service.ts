import { Injectable } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Injectable({providedIn: 'root'})
export class ChipsConfigService {

  // Enter, comma
  public static separatorKeysCodes = [ENTER, COMMA];

  constructor() {
  }
}
