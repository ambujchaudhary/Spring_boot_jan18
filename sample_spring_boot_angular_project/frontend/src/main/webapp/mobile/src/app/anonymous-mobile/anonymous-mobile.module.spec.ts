import { AnonymousMobileModule } from './anonymous-mobile.module';

describe('AnonymousMobileModule', () => {
  let anonymousMobileModule: AnonymousMobileModule;

  beforeEach(() => {
    anonymousMobileModule = new AnonymousMobileModule();
  });

  it('should create an instance', () => {
    expect(anonymousMobileModule).toBeTruthy();
  });
});
