import { Injectable } from '@angular/core';
import { ParentService } from '../abstract/parent.service';

@Injectable()
export class AlphaParentService extends ParentService {
  create() {
    return 'alpha-parent-creation';
  }
}
