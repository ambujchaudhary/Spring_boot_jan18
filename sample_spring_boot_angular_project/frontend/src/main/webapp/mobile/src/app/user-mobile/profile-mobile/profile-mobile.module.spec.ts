import { ProfileMobileModule } from './profile-mobile.module';

describe('ProfileMobileModule', () => {
  let profileMobileModule: ProfileMobileModule;

  beforeEach(() => {
    profileMobileModule = new ProfileMobileModule();
  });

  it('should create an instance', () => {
    expect(profileMobileModule).toBeTruthy();
  });
});
