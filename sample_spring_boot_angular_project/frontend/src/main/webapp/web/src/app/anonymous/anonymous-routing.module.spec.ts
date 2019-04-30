import { AnonymousRoutingModule } from './anonymous-routing.module';

describe('AnonymousRoutingModule', () => {
  let anonymousRoutingModule: AnonymousRoutingModule;

  beforeEach(() => {
    anonymousRoutingModule = new AnonymousRoutingModule();
  });

  it('should create an instance', () => {
    expect(anonymousRoutingModule).toBeTruthy();
  });
});
