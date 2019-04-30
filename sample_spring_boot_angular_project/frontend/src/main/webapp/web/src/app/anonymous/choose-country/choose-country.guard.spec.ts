import { TestBed, async, inject } from '@angular/core/testing';

import { ChooseCountryGuard } from './choose-country.guard';

describe('ChooseCountryGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChooseCountryGuard]
    });
  });

  it('should ...', inject([ChooseCountryGuard], (guard: ChooseCountryGuard) => {
    expect(guard).toBeTruthy();
  }));
});
