import { Injectable } from '@angular/core';
import { NotUsedService } from '../abstract/not-used.service';

@Injectable()
export class BetaNotUsedService extends NotUsedService {
  create() { return 'beta-not-used-service-creation'; }
}
