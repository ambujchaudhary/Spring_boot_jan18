import { TestBed, inject } from '@angular/core/testing';

import { NotificationsResolverService } from './notifications-resolver.service';

describe('NotificationsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsResolverService]
    });
  });

  it('should be created', inject([NotificationsResolverService], (service: NotificationsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
