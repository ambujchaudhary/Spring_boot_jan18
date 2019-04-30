import { UserMobileModule } from './user-mobile.module';

describe('UserMobileModule', () => {
  let userMobileModule: UserMobileModule;

  beforeEach(() => {
    userMobileModule = new UserMobileModule();
  });

  it('should create an instance', () => {
    expect(userMobileModule).toBeTruthy();
  });
});
