import { Injectable } from '@angular/core';
import { ChildService } from '../abstract/child.service';

@Injectable()
export class BetaChildService extends ChildService {
  create() {
    return 'beta-child-creation';
  }
}
