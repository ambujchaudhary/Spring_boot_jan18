import { Pipe, PipeTransform } from '@angular/core';
import { AdminUserData } from '../admin.model';

@Pipe({
  name: 'newUser'
})
export class NewUserPipe implements PipeTransform {
  transform(value: any[], term: string): any[] {
    const _temp = term.toLowerCase();

    return value.filter((user: AdminUserData) => {
      return (user.fullName || '').toLowerCase().includes(_temp) || (user.statusLabel || '').toLowerCase().includes(_temp);
    });

  }
}
