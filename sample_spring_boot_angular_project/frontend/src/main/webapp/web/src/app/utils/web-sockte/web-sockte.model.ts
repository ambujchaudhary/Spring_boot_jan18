import { StompConfig } from '@stomp/ng2-stompjs';
import { LocalStorageKey } from '../storage/local-storage.service';
import { environment } from '../../../../../environments/environment';

const host = environment.host || location.hostname;
const port = environment.port || '8080';
const protocol = environment.protocol || location.protocol;
const isHTTPS = protocol === 'https:';

const wsProtocol = isHTTPS ? 'wss' : 'ws';

const TOKEN_KEY: LocalStorageKey = 'authToken';

export class WebSocketConfig {
  public static url = `${wsProtocol}://${host}:${port}/ws`;
  public static notify = '/user/queue/notify';
  public static message = '/user/queue/message';
}

export const stompConfig: StompConfig = {
  // Which server?
  url: WebSocketConfig.url,

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    Authorization: (function() {
      return localStorage.getItem(TOKEN_KEY);
    })()
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  // debug: !wsProtocol
  debug: true
  //  debug: false
};

export enum StompStateEnum {
  CLOSED = 'CLOSED',
  TRYING = 'TRYING',
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING',
}
