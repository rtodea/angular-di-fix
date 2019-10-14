import { Injectable } from '@angular/core';
import { ParentService } from '../abstract/parent.service';

@Injectable()
export class BetaParentService extends ParentService {
  create() {
    return 'beta-parent-creation::' + this.childService.create();
  }
}
