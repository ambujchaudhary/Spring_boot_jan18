import { UserModule } from './user.module';

describe('UserModule', () => {
  let userProfileModule: UserModule;

  beforeEach(() => {
    userProfileModule = new UserModule();
  });

  it('should create an instance', () => {
    expect(userProfileModule).toBeTruthy();
  });
});
