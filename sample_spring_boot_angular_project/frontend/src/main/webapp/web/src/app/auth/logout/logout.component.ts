import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../utils/storage/local-storage.service';
import { SessionStorageService } from '../../utils/storage/session-storage.service';
import { WebSocketService } from '../../utils/web-sockte/web-sockte.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'zu-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {

  constructor(
      private authService: AuthService,
      private localStorageService: LocalStorageService,
      private sessionStorageService: SessionStorageService,
      private webSocketService: WebSocketService,
      private router: Router
  ) {
    this.logout();
  }

  private logout(): void {
    this.preLogoutHook();
    this.router.navigate(['/choose-your-country']);
  }

  private preLogoutHook(): void {
    this.localStorageService.delete('country');
    this.localStorageService.delete('authToken');
    this.localStorageService.delete('socialUser');
    this.cleanLoginModalsDataBeforeLogout();

    this.disconnectFromIntercom();

    this.webSocketService.disconnect();

    this.sessionStorageService.delete('user');
  }

  private disconnectFromIntercom(): void {
    (<any>window).Intercom('shutdown');
  }

  private cleanLoginModalsDataBeforeLogout(): void {
    this.localStorageService.delete('feedbackModalData');
    this.localStorageService.delete('preExpireJobModalData');
    this.localStorageService.delete('autocompleteModalData');
  }
}
