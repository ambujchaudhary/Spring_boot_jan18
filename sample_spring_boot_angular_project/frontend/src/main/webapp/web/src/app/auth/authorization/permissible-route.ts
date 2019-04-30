import { UserRole } from '../auth.model';

export class PermissibleRoute {
  constructor(private _path: RegExp, private _userRoles: Array<UserRole>) {
  }

  get userRoles(): Array<UserRole> {
    return this._userRoles;
  }

  get path(): RegExp {
    return this._path;
  }
}
