import { AnonymousModule } from './anonymous.module';

describe('AnonymousModule', () => {
  let anonymousModule: AnonymousModule;

  beforeEach(() => {
    anonymousModule = new AnonymousModule();
  });

  it('should create an instance', () => {
    expect(anonymousModule).toBeTruthy();
  });
});
