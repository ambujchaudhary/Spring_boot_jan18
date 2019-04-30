import { TestBed, async, inject } from '@angular/core/testing';

import { GuardBaseGuard } from './guard-base.guard';

describe('GuardBaseGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardBaseGuard],
    });
  });

  it('should ...', inject([GuardBaseGuard], (guard: GuardBaseGuard) => {
    expect(guard).toBeTruthy();
  }));
});
