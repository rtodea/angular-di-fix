import { Injectable } from '@angular/core';
import { NotUsedService } from '../abstract/not-used.service';

@Injectable()
export class AlphaNotUsedService extends NotUsedService {
  create() { return 'apha-not-used-service-creation'; }
}
