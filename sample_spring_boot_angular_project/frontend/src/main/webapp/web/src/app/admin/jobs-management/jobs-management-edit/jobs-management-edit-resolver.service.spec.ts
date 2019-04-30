import { TestBed } from '@angular/core/testing';

import { JobsManagementEditResolverService } from './jobs-management-edit-resolver.service';

describe('JobsManagementEditResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobsManagementEditResolverService = TestBed.get(JobsManagementEditResolverService);
    expect(service).toBeTruthy();
  });
});
