import { AuthMobileModule } from './auth-mobile.module';

describe('AuthMobileModule', () => {
  let authMobileModule: AuthMobileModule;

  beforeEach(() => {
    authMobileModule = new AuthMobileModule();
  });

  it('should create an instance', () => {
    expect(authMobileModule).toBeTruthy();
  });
});
