import "reflect-metadata";
import { injectable, inject, multiInject, optional } from "inversify";
import { rootContainer, providerContainer } from '..';

export function Injectable(serviceIdentifier?: any, container: 'provider' | 'root' = 'provider') {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    const targetContainer = container == 'root' ? rootContainer : providerContainer;
    const target = injectable()(constructor);
    targetContainer.bind(serviceIdentifier || target).to(target).inSingletonScope();
    return target;
  }
}

export function Overwrite(serviceIdentifier: any, container: 'provider' | 'root' = 'provider') {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    const targetContainer = container == 'root' ? rootContainer : providerContainer;
    if (targetContainer.isBound(serviceIdentifier)) targetContainer.unbind(serviceIdentifier);
    return Injectable(serviceIdentifier, container)(constructor);
  }
}

export function Inject(serviceIdentifier?: any) {
  return (target: any, targetKey: string, index?: number | undefined) => {
    const token = serviceIdentifier || Reflect.getMetadata('design:type', target, targetKey);
    return inject(token)(target, targetKey, index);
  };
}

export function MultiInject(serviceIdentifier: any) {
  return multiInject(serviceIdentifier);
}

export function Optional() {
  return optional();
}
