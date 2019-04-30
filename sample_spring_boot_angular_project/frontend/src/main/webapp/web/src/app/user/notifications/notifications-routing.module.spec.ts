import { NotificationsRoutingModule } from './notifications-routing.module';

describe('DashboardRoutinModule', () => {
  let notificationsRoutingModule: NotificationsRoutingModule;

  beforeEach(() => {
    notificationsRoutingModule = new NotificationsRoutingModule();
  });

  it('should create an instance', () => {
    expect(notificationsRoutingModule).toBeTruthy();
  });
});
