import { NgModule, Type } from '@angular/core';
import { ParentService } from './abstract/parent.service';
import { AlphaParentService } from './alpha/alpha-parent.service';
import { BetaParentService } from './beta/beta-parent.service';
import { ActivatedRoute } from '@angular/router';
import { ChildService } from './abstract/child.service';
import { AlphaChildService } from './alpha/alpha-child.service';
import { BetaChildService } from './beta/beta-child.service';
import { GfxInjector } from './gfx.injector';
import { NotUsedService } from './abstract/not-used.service';
import { AlphaNotUsedService } from './alpha/alpha-not-used.service';
import { BetaNotUsedService } from './beta/beta-not-used.service';

export const GFX_ENGINE_QUERY_PARAM_KEY = 'gfx';

export enum GFX_ENGINE_QUERY_PARAM_VALUES {
  ALPHA = 'alpha',
  BETA = 'beta',
}

export function switchFactory<T>(activatedRoute, options: Map<string, Type<T>>, fallback: Type<T>, queryParam: string) {
  if (!GfxInjector.INSTANCE) { console.log(new GfxInjector([[ActivatedRoute, activatedRoute]], staticProviderMap)); }
  const queryParams = activatedRoute.snapshot.queryParamMap;

  let serviceClass;
  let serviceInstance;
  if (!(queryParams.has(queryParam))) {
    serviceClass = fallback;
    serviceInstance = new fallback();
    GfxInjector.INSTANCE.set(serviceClass, serviceInstance);
    return serviceInstance;
  }

  const queryParamValue = queryParams.get(queryParam);
  if (!options.has(queryParamValue)) {
    serviceClass = fallback;
    serviceInstance = new fallback();
    GfxInjector.INSTANCE.set(serviceClass, serviceInstance);
    return serviceInstance;
  }

  const constructorOfCorrectType = options.get(queryParamValue);
  serviceClass = constructorOfCorrectType;
  serviceInstance = new constructorOfCorrectType();
  GfxInjector.INSTANCE.set(serviceClass, serviceInstance);
  return serviceInstance;
}

export function switchFactoryBasedOnGfxQueryParam<T>(activatedRoute, switcher: Map<string, Type<T>>, defaultTo: Type<T>) {
  return switchFactory<T>(activatedRoute, switcher, defaultTo, GFX_ENGINE_QUERY_PARAM_KEY);
}

export function switchFactoryBasedOnGfxQueryParamOnOptions<T>(activatedRoute,
                                                              alphaService: Type<T>, betaService: Type<T>, parentService: any) {
  const service = switchFactoryBasedOnGfxQueryParam<T>(activatedRoute, new Map<string, Type<T>>([
    [GFX_ENGINE_QUERY_PARAM_VALUES.ALPHA, alphaService],
    [GFX_ENGINE_QUERY_PARAM_VALUES.BETA, betaService],
  ]), alphaService);

  GfxInjector.INSTANCE.set(parentService, service);
  return service;
}

export function factoryForParentService(activatedRoute: ActivatedRoute) {
  return switchFactoryBasedOnGfxQueryParamOnOptions<ParentService>(activatedRoute,
    AlphaParentService,
    BetaParentService,
    ParentService);
}

export function factoryForChildService(activatedRoute: ActivatedRoute) {
  return switchFactoryBasedOnGfxQueryParamOnOptions<ChildService>(activatedRoute,
    AlphaChildService,
    BetaChildService,
    ChildService);
}

export function factoryForNotUsedService(activatedRoute: ActivatedRoute) {
  return switchFactoryBasedOnGfxQueryParamOnOptions<NotUsedService>(activatedRoute,
    AlphaNotUsedService,
    BetaNotUsedService,
    NotUsedService);
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

export const staticProviderForNotUsedService = provideServiceBasedOnGfxQueryParam<NotUsedService>(
  NotUsedService,
  AlphaNotUsedService,
  BetaNotUsedService,
  factoryForNotUsedService,
);

export const staticProviderForChildService = provideServiceBasedOnGfxQueryParam<ChildService>(
  ChildService,
  AlphaChildService,
  BetaChildService,
  factoryForChildService
);

export const staticProviderMap = new Map<any, any>([
  [ParentService, staticProviderForParentService],
  [ChildService, staticProviderForChildService],
  [NotUsedService, staticProviderForNotUsedService],
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
