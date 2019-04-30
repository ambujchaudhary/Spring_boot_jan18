import { AdminMobileModule } from './admin-mobile.module';

describe('AdminMobileModule', () => {
  let adminMobileModule: AdminMobileModule;

  beforeEach(() => {
    adminMobileModule = new AdminMobileModule();
  });

  it('should create an instance', () => {
    expect(adminMobileModule).toBeTruthy();
  });
});
