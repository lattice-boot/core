import { UriMatchersCtx } from '..';
import { HttpMethod } from '@core/http';

describe('UriMatchersCtx test', () => {
  let uriMatchersCtx: UriMatchersCtx;

  beforeAll(() => {
    uriMatchersCtx = new UriMatchersCtx();
  });

  it('should be get mounted matchers with uri and method', () => {
    const uriMatcher = {
      type: HttpMethod.GET,
      uri: '/a/b/c/d',
      payload: () => { },
    };
    uriMatchersCtx.mount(uriMatcher)
    const targetUriMatcher = uriMatchersCtx.get('/a/b/c/d', HttpMethod.GET);
    expect(targetUriMatcher).toBe(uriMatcher);
  });

  it('should be get mounted param matchers with uri and method', () => {
    const uriMatcher = {
      type: HttpMethod.GET,
      uri: '/c/:/mmp',
      payload: () => { },
    };
    uriMatchersCtx.mount(uriMatcher)
    const targetUriMatcher = uriMatchersCtx.get('/c/ahh/mmp', HttpMethod.GET);
    expect(targetUriMatcher).toBe(uriMatcher);
  });

  it('should be get mounted matchers with dirty uri and method', () => {
    const uriMatcher = {
      type: HttpMethod.GET,
      uri: '/a/b/c/d',
      payload: () => { },
    };
    uriMatchersCtx.mount(uriMatcher)
    const targetUriMatcher = uriMatchersCtx.get('a/b///c/d', HttpMethod.GET);
    expect(targetUriMatcher).toBe(uriMatcher);
  });
});
