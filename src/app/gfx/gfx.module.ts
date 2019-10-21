import { Injector, NgModule, Type } from '@angular/core';
import { ParentService } from './abstract/parent.service';
import { AlphaParentService } from './alpha/alpha-parent.service';
import { BetaParentService } from './beta/beta-parent.service';
import { ActivatedRoute } from '@angular/router';
import { ChildService } from './abstract/child.service';
import { AlphaChildService } from './alpha/alpha-child.service';
import { BetaChildService } from './beta/beta-child.service';

export const GFX_ENGINE_QUERY_PARAM_KEY = 'gfx';

export let GFX_INJECTOR: GfxInjector;

export enum GFX_ENGINE_QUERY_PARAM_VALUES {
  ALPHA = 'alpha',
  BETA = 'beta',
}

export function switchFactory<T>(activatedRoute, options: Map<string, Type<T>>, fallback: Type<T>, queryParam: string) {
  if (!GFX_INJECTOR) { GFX_INJECTOR = new GfxInjector([[ActivatedRoute, activatedRoute]]); }
  const queryParams = activatedRoute.snapshot.queryParamMap;

  let serviceClass;
  let serviceInstance;
  if (!(queryParams.has(queryParam))) {
    serviceClass = fallback;
    serviceInstance = new fallback();
    GFX_INJECTOR.set(serviceClass, serviceInstance);
    return serviceInstance;
  }

  const queryParamValue = queryParams.get(queryParam);
  if (!options.has(queryParamValue)) {
    serviceClass = fallback;
    serviceInstance = new fallback();
    GFX_INJECTOR.set(serviceClass, serviceInstance);
    return serviceInstance;
  }

  const constructorOfCorrectType = options.get(queryParamValue);
  serviceClass = constructorOfCorrectType;
  serviceInstance = new constructorOfCorrectType();
  GFX_INJECTOR.set(serviceClass, serviceInstance);
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
  GFX_INJECTOR.set(parentService, service);
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

export function staticMapEntries(tokens: any[], staticProvider) {
  const entries = [];
  tokens.forEach(token => {
    entries.push([token, staticProvider]);
  });

  return entries;
}


export class GfxInjector {
  services: Map<any, any>;

  staticProviderMap = new Map<any, any>([
    [ParentService, staticProviderForParentService],
    [ChildService, staticProviderForChildService],
  ]);

  constructor(initialServices?: [Type<any>, any][]) {
    if (!initialServices) {
      return;
    }

    this.services = new Map(initialServices);
  }

  set(serviceClass: any, serviceInstance: any) {
    this.services.set(serviceClass, serviceInstance);
  }

  get<T>(serviceClass: any): T {
    if (!this.services.has(serviceClass as Type<T>)) {
      this.createService(serviceClass);
    }
    return this.services.get(serviceClass as Type<T>);
  }

  createService(serviceClass) {
    const injector = Injector.create({
      providers: [
        {provide: ActivatedRoute, useValue: this.services.get(ActivatedRoute)},
        this.staticProviderMap.get(serviceClass),
      ]});
    return injector.get(serviceClass);
  }
}

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
