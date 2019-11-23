import { ControllerLoader, MiddlewareLoader, LATTICE_LOADER } from '@core/context';
import { controllerContainer, rootContainer } from '@core/inject';

describe('MiddlewareLoader silent test', () => {
  let controllerLoader: ControllerLoader;
  let middlewareLoader: MiddlewareLoader;

  beforeAll(() => {
    jest.spyOn(controllerContainer, 'getAll').mockImplementation(token => {
      throw 'error';
    });
  });

  afterAll(() => {
    jest.spyOn(controllerContainer, 'getAll').mockClear();
  })

  it('should not exception when middleware silent', () => {
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
    controllerLoader.exec();
    middlewareLoader.exec();
  })
});
