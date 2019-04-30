import { DashboardRoutingModule } from './dashboard-routing.module';

describe('DashboardRoutinModule', () => {
  let dashboardRoutinModule: DashboardRoutingModule;

  beforeEach(() => {
    dashboardRoutinModule = new DashboardRoutingModule();
  });

  it('should create an instance', () => {
    expect(dashboardRoutinModule).toBeTruthy();
  });
});
