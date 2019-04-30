import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { LocalStorageKey, LocalStorageService } from '../utils/storage/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  static requestHeader = '_JSESSION';
  private TOKEN_KEY: LocalStorageKey;

  constructor(
      private router: Router,
      private localStorageService: LocalStorageService
  ) {
    this.TOKEN_KEY = 'authToken';
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authorizationToken = this.localStorageService.get(this.TOKEN_KEY);
    let _request: HttpRequest<any>;

    if (authorizationToken) {

      // modify request
      _request = request.clone({
        setHeaders: {
          Authorization: authorizationToken
        }
      });
    }

    return next.handle(_request || request)
    .pipe(
        tap(
            (event) => {},
            (error) => {
              //              FIXME
              if (error.status === 401 && this.router.url !== '/login') {
                this.localStorageService.delete(this.TOKEN_KEY);
                this.router.navigate(['/choose-your-country']);
              }

            })
    );
  }

}
