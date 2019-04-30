import { MessagesRoutingModule } from './messages-routing.module';

describe('MessagesRoutingModule', () => {
  let messagesRoutingModule: MessagesRoutingModule;

  beforeEach(() => {
    messagesRoutingModule = new MessagesRoutingModule();
  });

  it('should create an instance', () => {
    expect(messagesRoutingModule).toBeTruthy();
  });
});
