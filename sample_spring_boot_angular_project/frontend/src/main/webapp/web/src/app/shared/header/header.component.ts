import { Component, ElementRef, OnInit, HostListener, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { User, UserRole, UserStatus } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { MessagesService } from '../../utils/messages.service';
import { SessionStorageService } from '../../utils/storage/session-storage.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';

@Component({
  selector: 'zu-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() show = false;
  @Output() jobEditedEmitter = new EventEmitter();

  @ViewChild('popup') popup: ElementRef;
  @ViewChild('popuptoggle') popupToggle: ElementRef;
  @ViewChild('burgertoggle') burgerToggle: ElementRef;
  @ViewChild('ipadmenu') iPadMenu: ElementRef;

  private profileId: string;
  public user: User;
  public isUser: boolean;
  public isPopupOpen = false;
  public hideOnMobile = false;

  constructor(
      private authService: AuthService,
      private elementRef: ElementRef,
      private sessionStorageService: SessionStorageService,
      private toaster: ToasterConfigService,
      private callbackService: CallbackHandlerService,
      private route: ActivatedRoute,
      private userService: UserService,
      private messagesService: MessagesService
  ) {
    this.authService.getUser().pipe(first()).subscribe((user: User) => {
      if (typeof user === 'object' && user.role) {
        this.isUser = user.role === UserRole.USER;
      } else {
        this.isUser = false;
      }
    });
  }

  ngOnInit() {
    if (this.show === true) {
      this.hideOnMobile = false;
    } else {
      this.route.data.pipe(first()).subscribe((data) => {
        this.hideOnMobile = data.hideHeaderOnMobile;
      });
    }

    this.checkUserInfo();
    this.getUserProfileId();
  }

  //  TODO refactor
  @HostListener('document:click', ['$event']) onClickOutHandler(event) {
    if (this.hideOnMobile === false) {
      return;
    }

    if ((this.popup && this.popup.nativeElement && !this.popup.nativeElement.contains(event.target))
        && (this.popupToggle && this.popupToggle.nativeElement && !this.popupToggle.nativeElement.contains(event.target))
        && (this.burgerToggle && this.burgerToggle.nativeElement && !this.burgerToggle.nativeElement.contains(event.target))
        && (this.iPadMenu && this.iPadMenu.nativeElement && !this.iPadMenu.nativeElement.contains(event.target))
    ) {
      this.hidePopup();
    }
  }

  //  private isNativeElement(element: 'popup' | 'popupToggle' | 'burgerToggle' | 'iPadMenu', event): boolean {
  //    return this.popup && this.popup.nativeElement && this.popup.nativeElement.contains(event.target);
  //  }

  private getUserInfo(): void {
    this.authService.getUser().pipe(first())
    .subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        }
    );
  }

  private checkUserInfo(): void {
    const sessionUser = this.sessionStorageService.getObject<User>('user');

    if (sessionUser === null) {
      this.getUserInfo();
    } else {
      this.user = sessionUser;
    }
  }

  private getUserProfileId(): void {
    if (typeof this.user === 'undefined' || this.user.role !== UserRole.USER) {
      return;
    }

    if (this.user.status !== UserStatus.EDITED && this.user.status !== UserStatus.VERIFICATION_SUCCESS) {
      return;
    }

    this.userService.getProfileId(this.user.id)
    .subscribe(
        (data) => {
          this.profileId = data.profileId;
        },
        () => {
          //          TODO uncomment
          //          this.messagesService.showError('common.message_error');
        }
    );
  }

  public setUserAvatar(): Object {
    if (typeof this.user !== 'undefined' && this.user.logo) {
      return {
        'background-image': 'url(' + this.user.logo + ')',
      };
    } else {
      return {};
    }
  }

  public togglePopup(): void {
    this.isPopupOpen = !this.isPopupOpen;
  }

  public hidePopup(): void {
    this.isPopupOpen = false;
  }

  public emitJobEditNotification(): void {
    this.jobEditedEmitter.emit();
  }

  public getProfileRedirectUrl(): string {
    if (this.profileId) {
      return `/profile/${this.profileId}`;
    } else {
      return `/profile`;
    }
  }
}
