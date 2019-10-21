import { Injectable } from '@angular/core';
import { ParentService } from '../abstract/parent.service';
import { GfxService } from '../gfx.injector';
import { ChildService } from '../abstract/child.service';
import { NotUsedService } from '../abstract/not-used.service';

@Injectable()
export class AlphaParentService extends ParentService {
  @GfxService(ChildService)
  childService: ChildService;

  @GfxService(NotUsedService)
  notUserService: NotUsedService;

  create() {
    return 'alpha-parent-creation::' + this.childService.create() + this.notUserService.create();
  }
}
