import { Middleware, MIDDLEWARE_META, MIDDLEWARE_TOKEN } from '../middleware';
import { controllerContainer } from '@core/inject';

describe('Controller Decorator test', () => {
  it('should be define metadata with middleware clazz', () => {
    @Middleware(/.*/, 2000)
    class TestClass { }

    expect(Reflect.getMetadata(MIDDLEWARE_META, TestClass)).toEqual({
      regExp: /.*/,
      weight: 2000
    });
  });

  it('should be insert to controller di container', () => {
    const middlewares = controllerContainer.getAll(MIDDLEWARE_TOKEN);
    expect(middlewares.length).toBe(1);
  });
});
