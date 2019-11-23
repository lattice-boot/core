import { controllerContainer } from '@core/inject';
import { injectable } from 'inversify';
import { LatticeMiddleware } from '../interface';

let defaultWeight = 100;

export const MIDDLEWARE_TOKEN = '__middleware__';
export const MIDDLEWARE_META = '__middleware_meta__';

export function Middleware(regExp: RegExp, weight?: number) {
  weight = weight || ++defaultWeight;
  return <T extends { new(...args: any[]): LatticeMiddleware }>(constructor: T) => {
    const targetContainer = controllerContainer;
    const target = injectable()(constructor);
    Reflect.defineMetadata(MIDDLEWARE_META, { regExp, weight }, target);
    targetContainer.bind(MIDDLEWARE_TOKEN).to(target).inSingletonScope();
    return target;
  }
}
