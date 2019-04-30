import { TestBed, inject } from '@angular/core/testing';

import { CallbackHandlerService } from './callback-handler.service';

describe('CallbackHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallbackHandlerService],
    });
  });

  it('should be created', inject([CallbackHandlerService], (service: CallbackHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
