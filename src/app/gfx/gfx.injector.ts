import { Injector, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export function GfxService(serviceClass: any) {
  return (target: object, propertyKey: string | symbol) => {
    let propertyValue = target[propertyKey];
    const getter = () => {
      if (!propertyValue) {
        propertyValue = GfxInjector.INSTANCE.get(serviceClass);
        return propertyValue;
      }
      return propertyValue;
    };

    const setter = (newValue) => {
      propertyValue = newValue;
    };

    if (delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      });
    }
  };
}

export class GfxInjector {
  static INSTANCE: GfxInjector;

  services: Map<any, any>;

  staticProviderMap: Map<any, any>;

  constructor(initialServices?: [Type<any>, any][], providerMap?: any) {
    if (initialServices) {
      this.services = new Map(initialServices);
    }

    if (providerMap) {
      this.staticProviderMap = providerMap;
    }

    GfxInjector.INSTANCE = this;
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
