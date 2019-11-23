import { Injectable, Inject, CONTROLLER_CONTAINER } from '@core/inject';
import { Container } from 'inversify';
import { RequestListener } from 'http';
import { LatticeLoader, LATTICE_LOADER } from './basic/loader';
import { UriMatchers } from '@core/bootstrap';
import { CONTROLLER_TOKEN, METHOD_META_LIST, MIDDLEWARE_TOKEN, MiddlewareMeta, MIDDLEWARE_META, LatticeMiddleware } from '@core/http';

@Injectable(LATTICE_LOADER, 'root')
export class MiddlewareLoader implements LatticeLoader {

  @Inject(CONTROLLER_CONTAINER)
  private controllerContainer!: Container;

  exec() {
    const { matchers, middlewares } = this;
    matchers.forEach(matcher => {
      middlewares.forEach(middleware => {
        middleware.regExp.test(matcher.uri) && this.insertLifecycle(matcher, middleware);
      })
    });
    return this;
  }

  getRequestListener(): RequestListener {
    return (req, res) => {
      // pass
    };
  }

  private get matchers() {
    try {
      return this.controllerContainer.getAll(CONTROLLER_TOKEN).reduce<UriMatchers[]>((target, instance: any) => {
        const metaList: UriMatchers[] = Reflect.getMetadata(METHOD_META_LIST, instance.constructor);
        metaList.forEach(meta => meta.ctx = instance);
        target.push(...metaList);
        return target;
      }, []);
    } catch {
      return [];
    }
  }

  private get middlewares() {
    try {
      return this.controllerContainer.getAll<LatticeMiddleware>(MIDDLEWARE_TOKEN).reduce<MiddlewareMeta[]>((target, instance: any) => {
        const meta: MiddlewareMeta = Reflect.getMetadata(MIDDLEWARE_META, instance.constructor);
        meta.payload = instance;
        target.push(meta);
        return target;
      }, []).sort((a, b) => b.weight - a.weight);
    } catch {
      return [];
    }
  }

  private insertLifecycle(matcher: UriMatchers, middleware: MiddlewareMeta) {
    console.log(`${middleware.payload!.constructor.name}: Insert lifecycle to ${matcher.uri}`);
    const beforeEndFunc = middleware.payload!.beforeEnd;
    const checkFunc = middleware.payload!.check;
    const catchFunc = middleware.payload!.catch;
    const nativeListener = matcher.payload.bind(matcher.ctx);
    matcher.payload = async (req, res) => {
      const nativeEndFunc = res.end;
      if (beforeEndFunc)
        res.end = (...args: any[]) => {
          Promise.resolve(beforeEndFunc.bind(middleware.payload)(req, res, matcher))
            .then(() => nativeEndFunc.bind(res)(...args));
        };
      checkFunc && await checkFunc.bind(middleware.payload)(req, res, matcher);
      try {
        if (!res.finished) {
          const result = await nativeListener(req, res);
          if (!res.finished) {
            res.end(JSON.stringify(result));
          }
        }
      } catch (error) {
        catchFunc && await catchFunc.bind(middleware.payload)(req, res, error, matcher);
      }
    };
  }
}