import { TestBed, inject } from '@angular/core/testing';

import { JobViewResolverService } from './job-view-resolver.service';

describe('JobViewResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobViewResolverService]
    });
  });

  it('should be created', inject([JobViewResolverService], (service: JobViewResolverService) => {
    expect(service).toBeTruthy();
  }));
});
