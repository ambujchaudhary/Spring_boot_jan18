import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], term: string): any[] {
    return value.filter(
        (x: any) => x.fullName.toLowerCase().includes(term.toLowerCase()) || x.address.toLowerCase().includes(term.toLowerCase()));

  }
}
