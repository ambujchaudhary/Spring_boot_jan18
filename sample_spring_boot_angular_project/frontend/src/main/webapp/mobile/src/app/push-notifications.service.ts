import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { DeviceInfo } from '../../../web/src/app/user/user.model';
import { UserService } from '../../../web/src/app/user/user.service';
import { LocalStorageService } from '../../../web/src/app/utils/storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  private deviceInfo: DeviceInfo;

  constructor(
      private firebase: Firebase,
      private afs: AngularFirestore,
      private platform: Platform,
      private localStorageService: LocalStorageService,
      private userService: UserService
  ) {}

  async getToken(id) {
    let token;

    try {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    } catch (e) {
      console.error(e);
    }

    this.sendDeviceInfo(token, id);

  }

  private fillData(token, id): void {
    this.deviceInfo = new DeviceInfo(id, token);
  }

  private sendDeviceInfo(token, id): void {
    console.log('get token', token);

    if (!token) {
      return;
    }

    this.fillData(token, id);

    this.userService.sendDeviceInfo(this.deviceInfo).subscribe(
        () => {
          console.log('sent');
        },
        (err) => {
          console.log('Device info send error!>', err);
        }
    );
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}
