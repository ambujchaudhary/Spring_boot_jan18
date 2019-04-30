import { Pipe, PipeTransform } from '@angular/core';
import { AdminJobData } from '../admin.model';

@Pipe({
  name: 'jobsTitle'
})
export class JobsTitlePipe implements PipeTransform {

  transform(value: any[], term: string): any[] {
    return value.filter(
        (job: AdminJobData) => job.title.toLowerCase().includes(term.toLowerCase()));
  }

}
