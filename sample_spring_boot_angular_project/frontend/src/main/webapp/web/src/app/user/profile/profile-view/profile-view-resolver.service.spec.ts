import { TestBed, inject } from '@angular/core/testing';

import { ProfileViewResolverService } from './profile-view-resolver.service';

describe('ProfileViewResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileViewResolverService]
    });
  });

  it('should be created', inject([ProfileViewResolverService], (service: ProfileViewResolverService) => {
    expect(service).toBeTruthy();
  }));
});
