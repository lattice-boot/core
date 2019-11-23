import { injectable } from 'inversify';
import { UriMatchers } from '@core/bootstrap';
import { METHOD_META_LIST } from '.';
import { controllerContainer } from '@core/inject';
import { UriUtils } from '@core/utils';

export const CONTROLLER_TOKEN = '__controller__';

export function Controller(uri = '') {
  return (target: any) => {
    const metaList: UriMatchers[] = Reflect.getMetadata(METHOD_META_LIST, target) || [];
    metaList.forEach(matcher => matcher.uri = UriUtils.join(uri, matcher.uri));
    Reflect.defineMetadata(METHOD_META_LIST, metaList, target);
    controllerContainer.bind(CONTROLLER_TOKEN).to(target).inSingletonScope();
    return injectable()(target);
  };
}