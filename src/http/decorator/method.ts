import { UriMatchers } from '@core/bootstrap';
import { HttpMethod } from '..';

export const METHOD_META_LIST = '__method_meta_list__';

export function Method(method: HttpMethod, uri = '') {
  return (target: any, targetKey: string) => {
    const metaList: UriMatchers[] = Reflect.getMetadata(METHOD_META_LIST, target.constructor) || [];
    metaList.push({ uri, type: method, payload: target[targetKey] });
    Reflect.defineMetadata(METHOD_META_LIST, metaList, target.constructor);
  };
}

export function Get(uri = '') {
  return Method(HttpMethod.GET, uri);
}

export function Post(uri = '') {
  return Method(HttpMethod.POST, uri);
}

export function Put(uri = '') {
  return Method(HttpMethod.PUT, uri);
}

export function Delete(uri = '') {
  return Method(HttpMethod.DELETE, uri);
}