import { Injectable } from '@angular/core';
import { ChildService } from './child.service';

@Injectable()
export abstract class ParentService {
  public childService: ChildService;

  abstract create();
}
