import { Controller, Get, HttpStatus } from '@core/http';
import { rootContainer } from '@core/inject';
import { ControllerLoader, LATTICE_LOADER } from '..';
import { UriMatchersCtx } from '@core/context';

describe('ControllerLoader test', () => {
  let controllerLoader: ControllerLoader;

  beforeAll(() => {
    controllerLoader = rootContainer.getAll(LATTICE_LOADER).reduce<ControllerLoader>((traget, value) => {
      if (value instanceof ControllerLoader)
        traget = value;
      return traget;
    }, {} as any);
  });

  it('should be load controller meta mounted to context', () => {
    @Controller('/test')
    class TestController {
      @Get('hello') hello() { };
    }
    const uriMatchersCtx = rootContainer.get(UriMatchersCtx);
    controllerLoader.exec();
    const uriMatcher = uriMatchersCtx.get('/test/hello');
    expect(uriMatcher).not.toBeUndefined();
  });

  it('should be getRequestListener', () => {
    const listener = controllerLoader.getRequestListener();
    expect(listener).not.toBeUndefined();
  });

  it('should be hit matcher with mouted uri', async () => {
    @Controller('/test')
    class TestController {
      @Get('hello') hello(req: any, res: any) {
        res.finished = true;
      };
    }

    const req = { url: '/test/hello' } as any, res = {} as any;
    const listener = controllerLoader.exec().getRequestListener();
    await listener(req, res);
    expect(res.finished).toBe(true);
  });

  it('should be miss matcher with unmouted uri', async () => {
    const req = { url: '/test/wrong/uri' } as any, res = { end: (str: string) => { } } as any;
    const listener = controllerLoader.exec().getRequestListener();
    await listener(req, res);
    expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
  });
});
