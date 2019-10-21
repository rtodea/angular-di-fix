import { Component, OnInit } from '@angular/core';
import { ParentService } from '../gfx/abstract/parent.service';
import { NotUsedService } from '../gfx/abstract/not-used.service';
import { BetaNotUsedService } from '../gfx/beta/beta-not-used.service';
import { AlphaNotUsedService } from '../gfx/alpha/alpha-not-used.service';
import { ChildService } from '../gfx/abstract/child.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public parentService: ParentService) {
    // parentService.childService = GFX_INJECTOR.get(ChildService);

    this.debug({
      notUsedService: NotUsedService,
      alphaNotUsedService: AlphaNotUsedService,
      betaNotUsedService: BetaNotUsedService,
    });
  }

  debug(object) {
    Object.entries(object).forEach(([key, value]) => {
      window[key] = value;
    });
  }

  ngOnInit() {
  }

}
