import { BusinessProfileModule } from './business-profile.module';

describe('BusinessProfileModule', () => {
  let businessProfileModule: BusinessProfileModule;

  beforeEach(() => {
    businessProfileModule = new BusinessProfileModule();
  });

  it('should create an instance', () => {
    expect(businessProfileModule).toBeTruthy();
  });
});
