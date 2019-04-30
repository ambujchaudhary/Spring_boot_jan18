import { UserRole } from '../auth.model';
import { PermissibleRoute } from './permissible-route';

export const PERMISSIBLE_ROUTES = [
  // Public routes
  new PermissibleRoute(/\/login/, [UserRole.ANONYMOUS]),
  new PermissibleRoute(/\/register/, [UserRole.ANONYMOUS, UserRole.USER]),
  new PermissibleRoute(/\/register\/\S+/, [UserRole.ANONYMOUS, UserRole.USER]),
  new PermissibleRoute(/\/forgot/, [UserRole.ANONYMOUS]),
  new PermissibleRoute(/\/logout/, []),
  new PermissibleRoute(/\/change-password\/\S+/, [UserRole.ANONYMOUS]),
  new PermissibleRoute(/\/change-password/, [UserRole.ANONYMOUS]),
  new PermissibleRoute(/\/choose-your-country/, [UserRole.ANONYMOUS]),

  // Admin pages
  new PermissibleRoute(/\/admin/, [UserRole.ADMIN]),
  new PermissibleRoute(/\/admin\/\S+/, [UserRole.ADMIN]),
  new PermissibleRoute(/\/admin\/user-profile\/\S+/, [UserRole.ADMIN]),
  new PermissibleRoute(/\/admin\/user-profile\/\W+\/edit/, [UserRole.ADMIN]),
  new PermissibleRoute(/\/job-management/, [UserRole.ADMIN]),
  new PermissibleRoute(/\/job-management\/\W+\/view/, [UserRole.ADMIN]),
  new PermissibleRoute(/\/job-management\/\W+\/edit/, [UserRole.ADMIN]),
  new PermissibleRoute(/\/admin-reports/, [UserRole.ADMIN]),

  // Protected routes
  new PermissibleRoute(/\/dashboard/, [UserRole.USER]),
  new PermissibleRoute(/\/toolkit/, [UserRole.USER]),
  new PermissibleRoute(/\/business-profile/, [UserRole.USER]),
  new PermissibleRoute(/\/settings/, [UserRole.USER]),
  new PermissibleRoute(/\/profile\/pending/, [UserRole.USER]),
  new PermissibleRoute(/\/profile\/\W+/, [UserRole.USER]),
  new PermissibleRoute(/\/profile/, [UserRole.USER]),
  new PermissibleRoute(/\/jobs/, [UserRole.USER]),
  new PermissibleRoute(/\/find-job/, [UserRole.USER]),
  new PermissibleRoute(/\/job/, [UserRole.USER]),
  new PermissibleRoute(/\/job\/\W+/, [UserRole.USER]),
  new PermissibleRoute(/\/job\/\W+\/view/, [UserRole.USER]),
  new PermissibleRoute(/\/notifications/, [UserRole.USER]),
  new PermissibleRoute(/\/messages/, [UserRole.USER]),
];
