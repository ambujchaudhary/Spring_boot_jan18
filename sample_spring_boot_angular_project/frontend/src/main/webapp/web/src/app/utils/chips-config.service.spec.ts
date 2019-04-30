import { TestBed, inject } from '@angular/core/testing';

import { ChipsConfigService } from './chips-config.service';

describe('ChipsConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChipsConfigService],
    });
  });

  it('should be created', inject([ChipsConfigService], (service: ChipsConfigService) => {
    expect(service).toBeTruthy();
  }));
});
