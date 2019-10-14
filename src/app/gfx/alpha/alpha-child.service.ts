import { Injectable } from '@angular/core';
import { ChildService } from '../abstract/child.service';

@Injectable()
export class AlphaChildService extends ChildService {
  create() {
    return 'alpha-child-creation';
  }
}
