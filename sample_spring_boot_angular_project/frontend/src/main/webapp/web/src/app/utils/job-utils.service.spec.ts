import { TestBed, inject } from '@angular/core/testing';

import { JobUtilsService } from './job-utils.service';

describe('JobUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobUtilsService]
    });
  });

  it('should be created', inject([JobUtilsService], (service: JobUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
