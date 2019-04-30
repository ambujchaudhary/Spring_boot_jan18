import { SharedUserModule } from './shared-user.module';

describe('SharedUserModule', () => {
  let sharedUserModule: SharedUserModule;

  beforeEach(() => {
    sharedUserModule = new SharedUserModule();
  });

  it('should create an instance', () => {
    expect(sharedUserModule).toBeTruthy();
  });
});
