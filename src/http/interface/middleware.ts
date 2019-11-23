import { IncomingMessage, ServerResponse } from 'http';
import { UriMatchers } from '@core/bootstrap';

export interface LatticeMiddleware extends Partial<MiddlewareLifecycle> { }

export interface MiddlewareMeta {
  constructor(): MiddlewareMeta;
  regExp: RegExp;
  weight: number;
  payload?: LatticeMiddleware;
}

export interface OnFuncCheck {
  check(req: IncomingMessage, res: ServerResponse, matcher?: UriMatchers): void | Promise<void>;
}

export interface OnBeforeEnd {
  beforeEnd(req: IncomingMessage, res: ServerResponse, matcher?: UriMatchers): void | Promise<void>;
}

export interface OnException {
  catch(req: IncomingMessage, res: ServerResponse, error: any, matcher?: UriMatchers): void | Promise<void>;
}

export type MiddlewareLifecycle = OnFuncCheck & OnBeforeEnd & OnException;
