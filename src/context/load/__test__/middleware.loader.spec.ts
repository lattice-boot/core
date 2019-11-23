import { MiddlewareLoader, LATTICE_LOADER, ControllerLoader } from '..';
import { rootContainer } from '@core/inject';
import { Controller, Get, Middleware, OnFuncCheck, OnBeforeEnd, OnException } from '@core/http';
import { UriMatchersCtx } from '@core/context';

describe('MiddlewareLoader test', () => {
  let controllerLoader: ControllerLoader;
  let middlewareLoader: MiddlewareLoader;
  let lifecycleRecord: string[] = [];

  beforeAll(() => {
    middlewareLoader = rootContainer.getAll(LATTICE_LOADER).reduce<MiddlewareLoader>((traget, value) => {
      if (value instanceof MiddlewareLoader)
        traget = value;
      return traget;
    }, {} as any);
    controllerLoader = rootContainer.getAll(LATTICE_LOADER).reduce<ControllerLoader>((traget, value) => {
      if (value instanceof ControllerLoader)
        traget = value;
      return traget;
    }, {} as any);

    @Controller('/test1')
    class TestController {
      @Get('hello') hello(req: any, res: any) {
        lifecycleRecord.push('payload');
        res.end();
      };
      @Get('no-end') end(req: any, res: any) {
        lifecycleRecord.push('payload');
      };
      @Get('end-of-return') endOfReturn() {
        return 'end-of-return';
      }
      @Get('throw') throw() {
        lifecycleRecord.push('payload');
        throw 'error';
      }
    }

    @Controller('/test-checked-end')
    class TestController2 {
      @Get() hello(req: any, res: any) {
        lifecycleRecord.push('payload');
        res.end();
      };
    }

    @Middleware(/.*test1/)
    class TestMiddleware implements OnFuncCheck, OnBeforeEnd, OnException {
      check(req: import("http").IncomingMessage, res: import("http").ServerResponse): void | Promise<void> {
        lifecycleRecord.push('check');
      }
      beforeEnd(req: import("http").IncomingMessage, res: import("http").ServerResponse): void | Promise<void> {
        lifecycleRecord.push('beforeEnd');
      }
      catch(req: import("http").IncomingMessage, res: import("http").ServerResponse, error: any): void | Promise<void> {
        lifecycleRecord.push('catch');
      }
    }

    @Middleware(/.*test-checked-end/)
    class TestMiddleware2 implements OnFuncCheck, OnBeforeEnd, OnException {
      check(req: import("http").IncomingMessage, res: import("http").ServerResponse): void | Promise<void> {
        lifecycleRecord.push('check');
        res.end();
      }
      beforeEnd(req: import("http").IncomingMessage, res: import("http").ServerResponse): void | Promise<void> {
        lifecycleRecord.push('beforeEnd');
      }
      catch(req: import("http").IncomingMessage, res: import("http").ServerResponse, error: any): void | Promise<void> {
        lifecycleRecord.push('catch');
      }
    }

    controllerLoader.exec();
    middlewareLoader.exec();
  });

  it('should be covered up payload lifecycle caller when finished', async () => {
    const matchersCtx = rootContainer.get(UriMatchersCtx);
    const targetPayloadFunc = matchersCtx.get('/test1/hello').payload;
    const res: any = {
      end: () => {
        res.finished = true;
      }
    };
    await targetPayloadFunc({}, res);
    expect(lifecycleRecord).toEqual([
      'check',
      'payload',
      'beforeEnd'
    ]);
  });

  it('should be auto end when logic lost end of request', async () => {
    lifecycleRecord = [];
    const matchersCtx = rootContainer.get(UriMatchersCtx);
    const targetPayloadFunc = matchersCtx.get('/test1/no-end').payload;
    const res: any = {
      end: () => {
        res.finished = true;
      }
    };
    await targetPayloadFunc({}, res);
    expect(res.finished).toBe(true);
  });

  it('should be end of return when logic lost end of request', async () => {
    lifecycleRecord = [];
    const matchersCtx = rootContainer.get(UriMatchersCtx);
    const targetPayloadFunc = matchersCtx.get('/test1/end-of-return').payload;
    const res: any = {
      end: (result: string) => {
        res.result = result;
      }
    };
    await targetPayloadFunc({}, res);
    expect(res.result).toBe('"end-of-return"');
  });

  it('should be covered up payload lifecycle caller when exception', async () => {
    lifecycleRecord = [];
    const matchersCtx = rootContainer.get(UriMatchersCtx);
    const targetPayloadFunc = matchersCtx.get('/test1/throw').payload;
    await targetPayloadFunc({}, {});
    expect(lifecycleRecord).toEqual([
      'check',
      'payload',
      'catch'
    ]);
  });

  it('should skip lifecycle when request end at on check', async () => {
    lifecycleRecord = [];
    const matchersCtx = rootContainer.get(UriMatchersCtx);
    const targetPayloadFunc = matchersCtx.get('/test-checked-end').payload;
    const res: any = {
      end: () => {
        res.finished = true;
      }
    };
    await targetPayloadFunc({}, res);
    expect(lifecycleRecord).toEqual([
      'check',
      'beforeEnd'
    ]);
  });

  it('should be getRequestListener', () => {
    const listener = middlewareLoader.getRequestListener();
    expect(listener).not.toBeUndefined();
  });
});
