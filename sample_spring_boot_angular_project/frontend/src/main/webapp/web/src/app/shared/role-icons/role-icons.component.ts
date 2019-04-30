import { Component, Input } from '@angular/core';
import { JobTypeEnum } from '../../user/job/job.model';
import { WorkerRoleEnum } from '../../user/user.model';

@Component({
  selector: 'zu-role-icons',
  templateUrl: './role-icons.component.html',
  styleUrls: ['./role-icons.component.scss']
})
export class RoleIconsComponent {

  @Input() roles: JobTypeEnum | WorkerRoleEnum;
}
