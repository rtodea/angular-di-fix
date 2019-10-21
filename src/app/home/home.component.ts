import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParentService } from '../gfx/abstract/parent.service';
import { ChildService } from '../gfx/abstract/child.service';
import { NotUsedService } from '../gfx/abstract/not-used.service';
import { BetaNotUsedService } from '../gfx/beta/beta-not-used.service';
import { AlphaNotUsedService } from '../gfx/alpha/alpha-not-used.service';
import { staticProviderMap } from '../gfx/gfx.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public parentService: ParentService,
              public injector: Injector) {
    const customInjector = Injector.create({
      providers: [
        {provide: ActivatedRoute, useValue: injector.get(ActivatedRoute)},
        staticProviderMap.get(ChildService),
      ]});
    const childService = customInjector.get(ChildService);
    parentService.childService = childService;

    this.debug({
      injector,
      notUsedService: NotUsedService,
      alphaNotUsedService: AlphaNotUsedService,
      betaNotUsedService: BetaNotUsedService
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
