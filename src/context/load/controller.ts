import { RequestListener } from 'http';
import { Container } from 'inversify';

import { UriMatchers } from '@core/bootstrap';
import {
  CONTROLLER_TOKEN, HttpExceptionRequestListener, HttpMethod, METHOD_META_LIST
} from '@core/http';
import { CONTROLLER_CONTAINER, Inject, Injectable } from '@core/inject';

import { UriMatchersCtx } from '../match';
import { UriMatcherRefiner } from './matcher-refiner';
import { LatticeLoader, LATTICE_LOADER } from './basic/loader';

@Injectable(LATTICE_LOADER, 'root')
export class ControllerLoader implements LatticeLoader {

  @Inject(CONTROLLER_CONTAINER)
  private controllerContainer!: Container;

  @Inject()
  private uriMatchersCtx!: UriMatchersCtx;

  exec() {
    this.controllInstanceArray.forEach((instance: any) => {
      const metaList: UriMatchers[] = Reflect.getMetadata(METHOD_META_LIST, instance.constructor) || [];
      metaList.forEach(matcher => this.uriMatchersCtx.mount(UriMatcherRefiner.refine(matcher)));
    });
    return this;
  }

  getRequestListener(): RequestListener {
    return async (req, res) => {
      if (res.finished) return;
      const uriMatchers = this.uriMatchersCtx.get(req.url || '/', req.method as HttpMethod);
      uriMatchers ? await uriMatchers.payload(req, res) : HttpExceptionRequestListener.notFindListener(req, res);
    };
  }

  private get controllInstanceArray() {
    try {
      return this.controllerContainer.getAll(CONTROLLER_TOKEN);
    } catch  {
      return [];
    }
  }
}