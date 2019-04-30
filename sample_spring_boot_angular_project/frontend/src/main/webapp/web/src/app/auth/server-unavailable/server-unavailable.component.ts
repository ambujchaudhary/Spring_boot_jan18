import { Component } from '@angular/core';
import { LocalStorageService } from '../../utils/storage/local-storage.service';

@Component({
  selector: 'zu-server-unavailable',
  templateUrl: './server-unavailable.component.html',
  styleUrls: ['./server-unavailable.component.scss']
})
export class ServerUnavailableComponent {
  constructor(
      private localStorageService: LocalStorageService
  ) { }

  public reload(): void {
    this.localStorageService.delete('authToken');
    window.location.href = window.location.origin + '/';
  }
}
