import { TestBed, inject } from '@angular/core/testing';

import { PermissibleRouteService } from './permissible-route.service';

describe('PermissibleRouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissibleRouteService],
    });
  });

  it('should be created', inject([PermissibleRouteService], (service: PermissibleRouteService) => {
    expect(service).toBeTruthy();
  }));
});
