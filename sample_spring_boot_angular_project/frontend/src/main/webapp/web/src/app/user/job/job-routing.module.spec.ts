import { JobRoutingModule } from './job-routing.module';

describe('JobRoutingModule', () => {
  let jobRoutingModule: JobRoutingModule;

  beforeEach(() => {
    jobRoutingModule = new JobRoutingModule();
  });

  it('should create an instance', () => {
    expect(jobRoutingModule).toBeTruthy();
  });
});
