import { NgModule, Type } from '@angular/core';
import { ParentService } from './abstract/parent.service';
import { AlphaParentService } from './alpha/alpha-parent.service';
import { BetaParentService } from './beta/beta-parent.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

export const GFX_ENGINE_QUERY_PARAM_KEY = 'gfx';

export enum GFX_ENGINE_QUERY_PARAM_VALUES {
  ALPHA = 'alpha',
  BETA = 'beta',
}

export function switchFactory<T>(activatedRoute, options: Map<string, Type<T>>, fallback: Type<T>, queryParam: string) {
  const queryParams = activatedRoute.snapshot.queryParamMap;

  if (!(queryParams.has(queryParam))) {
    return new fallback();
  }

  const queryParamValue = queryParams.get(queryParam);
  if (!options.has(queryParamValue)) {
    return new fallback();
  }

  const constructorOfCorrectType = options.get(queryParamValue);
  return new constructorOfCorrectType();
}

export function switchFactoryBasedOnGfxQueryParam<T>(activatedRoute, switcher: Map<string, Type<T>>, defaultTo: Type<T>) {
  return switchFactory<T>(activatedRoute, switcher, defaultTo, GFX_ENGINE_QUERY_PARAM_KEY);
}

export function switchFactoryBasedOnGfxQueryParamOnOptions<T>(activatedRoute, alphaService: Type<T>, betaService: Type<T>) {
  return switchFactoryBasedOnGfxQueryParam<T>(activatedRoute, new Map<string, Type<T>>([
    [GFX_ENGINE_QUERY_PARAM_VALUES.ALPHA, alphaService],
    [GFX_ENGINE_QUERY_PARAM_VALUES.BETA, betaService],
  ]), alphaService);
}

export function factoryForParentService(activatedRoute: ActivatedRoute) {
  return switchFactoryBasedOnGfxQueryParamOnOptions<ParentService>(activatedRoute,
    AlphaParentService,
    BetaParentService);
}

export function provideServiceBasedOnGfxQueryParam<T>(abstractService: any, alphaService: Type<T>, betaService: Type<T>, factory: any) {
  return {
    provide: abstractService,
    useFactory: factory,
    deps: [
      ActivatedRoute,
    ]
  };
}

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    provideServiceBasedOnGfxQueryParam<ParentService>(
      ParentService,
      AlphaParentService,
      BetaParentService,
      factoryForParentService
    )
  ],
  bootstrap: []
})
export class GfxModule { }
