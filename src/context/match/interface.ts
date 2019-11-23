import { UriMatchers } from '@core/bootstrap';

export interface UriMethodMap {
  [method: string]: UriMatchers;
}

export interface UriCtxMap {
  [uri: string]: UriMethodMap | UriCtxMap;
}