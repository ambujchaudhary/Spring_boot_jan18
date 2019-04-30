import { TestBed, inject } from '@angular/core/testing';

import { PostJobResolverService } from './post-job-resolver.service';

describe('PostJobResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostJobResolverService]
    });
  });

  it('should be created', inject([PostJobResolverService], (service: PostJobResolverService) => {
    expect(service).toBeTruthy();
  }));
});
