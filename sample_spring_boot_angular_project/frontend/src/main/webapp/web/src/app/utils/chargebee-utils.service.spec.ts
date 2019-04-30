import { TestBed } from '@angular/core/testing';

import { ChargebeeUtilsService } from './chargebee-utils.service';

describe('ChargebeeUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChargebeeUtilsService = TestBed.get(ChargebeeUtilsService);
    expect(service).toBeTruthy();
  });
});
