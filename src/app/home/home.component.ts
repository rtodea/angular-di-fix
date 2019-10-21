import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParentService } from '../gfx/abstract/parent.service';
import { ChildService } from '../gfx/abstract/child.service';
import { NotUsedService } from '../gfx/abstract/not-used.service';
import { BetaNotUsedService } from '../gfx/beta/beta-not-used.service';
import { AlphaNotUsedService } from '../gfx/alpha/alpha-not-used.service';
import { factoryForChildService, provideServiceBasedOnGfxQueryParam } from '../gfx/gfx.module';
import { AlphaChildService } from '../gfx/alpha/alpha-child.service';
import { BetaChildService } from '../gfx/beta/beta-child.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public activatedRoute: ActivatedRoute,
              public parentService: ParentService,
              public injector: Injector) {
    const customInjector = Injector.create({
      providers: [
        {provide: ActivatedRoute, useValue: activatedRoute},
        provideServiceBasedOnGfxQueryParam<ChildService>(
          ChildService,
          AlphaChildService,
          BetaChildService,
          factoryForChildService
        )
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
