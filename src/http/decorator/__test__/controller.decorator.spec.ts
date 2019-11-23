import { Controller } from '../controller';
import { Get, METHOD_META_LIST, Post, Put, Delete, Method } from '../method';
import { HttpMethod } from '@core/http/enum';

describe('Controller Decorator test', () => {
  it('should define metadata with @Controller() and @Get()', () => {
    @Controller('/test')
    class TestController {
      @Get('get') get() { }
    }
    const meta = Reflect.getMetadata(METHOD_META_LIST, TestController);
    expect(meta[0].uri).toEqual('/test/get');
    expect(meta[0].type).toEqual(HttpMethod.GET);
    expect(meta[0].payload).toBeInstanceOf(Function);
  });

  it('should define metadata with @Controller() and @Post()', () => {
    @Controller('/test')
    class TestController {
      @Post('post') post() { }
    }
    const meta = Reflect.getMetadata(METHOD_META_LIST, TestController);
    expect(meta[0].uri).toEqual('/test/post');
    expect(meta[0].type).toEqual(HttpMethod.POST);
    expect(meta[0].payload).toBeInstanceOf(Function);
  });

  it('should define metadata with @Controller() and @Put()', () => {
    @Controller('/test')
    class TestController {
      @Put('put') put() { }
    }
    const meta = Reflect.getMetadata(METHOD_META_LIST, TestController);
    expect(meta[0].uri).toEqual('/test/put');
    expect(meta[0].type).toEqual(HttpMethod.PUT);
    expect(meta[0].payload).toBeInstanceOf(Function);
  });

  it('should define metadata with @Controller() and @DELETE()', () => {
    @Controller('/test')
    class TestController {
      @Delete('delete') delete() { }
    }
    const meta = Reflect.getMetadata(METHOD_META_LIST, TestController);
    expect(meta[0].uri).toEqual('/test/delete');
    expect(meta[0].type).toEqual(HttpMethod.DELETE);
    expect(meta[0].payload).toBeInstanceOf(Function);
  });

  it('should define metadata with @Controller() and @Method()', () => {
    @Controller('/test')
    class TestController {
      @Method(HttpMethod.DELETE, 'any') any() { }
    }
    const meta = Reflect.getMetadata(METHOD_META_LIST, TestController);
    expect(meta[0].uri).toEqual('/test/any');
    expect(meta[0].type).toEqual(HttpMethod.DELETE);
    expect(meta[0].payload).toBeInstanceOf(Function);
  });

  it('should define metadata with @Controller() to empty class', () => {
    @Controller()
    class TestController {
    }
    const meta = Reflect.getMetadata(METHOD_META_LIST, TestController);
    expect(meta.length).toBe(0);
  });

  it('should define metadata with @Controller() and method decorator default param', () => {
    @Controller()
    class TestController {
      @Get() get() { }
      @Post() post() { }
      @Put() put() { }
      @Delete() delete() { }
      @Method(HttpMethod.DELETE) any() { }
    }
    const meta = Reflect.getMetadata(METHOD_META_LIST, TestController);
    expect(meta.length).toBe(5);
  });

  it('should define clear uri with matcher meta', () => {
    @Controller('test')
    class TestController {
      @Method(HttpMethod.DELETE, '//any') any() { }
    }
    const meta = Reflect.getMetadata(METHOD_META_LIST, TestController);
    expect(meta[0].uri).toEqual('/test/any');
  });
});
