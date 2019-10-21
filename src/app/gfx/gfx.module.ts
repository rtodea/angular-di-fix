import { NgModule, StaticProvider, Type } from '@angular/core';
import { ParentService } from './abstract/parent.service';
import { AlphaParentService } from './alpha/alpha-parent.service';
import { BetaParentService } from './beta/beta-parent.service';
import { ActivatedRoute } from '@angular/router';
import { ChildService } from './abstract/child.service';
import { AlphaChildService } from './alpha/alpha-child.service';
import { BetaChildService } from './beta/beta-child.service';

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

export function factoryForChildService(activatedRoute: ActivatedRoute) {
  return switchFactoryBasedOnGfxQueryParamOnOptions<ChildService>(activatedRoute,
    AlphaChildService,
    BetaChildService);
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

export const staticProviderForParentService = provideServiceBasedOnGfxQueryParam<ParentService>(
  ParentService,
  AlphaParentService,
  BetaParentService,
  factoryForParentService
  );

export const staticProviderForChildService = provideServiceBasedOnGfxQueryParam<ChildService>(
  ChildService,
  AlphaChildService,
  BetaChildService,
  factoryForChildService
);

export const staticProviderMap = new Map([
  [ParentService, staticProviderForParentService],
  [ChildService, staticProviderForChildService],
]);

// This will not work in prod mode
// export const providers: StaticProvider[] = [...staticProviderMap.values()];
export const providers = [
  staticProviderForParentService,
  staticProviderForChildService,
];

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers,
  bootstrap: []
})
export class GfxModule { }
