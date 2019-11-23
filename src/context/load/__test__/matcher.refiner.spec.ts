import { UriMatchers, ParamUriMatchers } from '@core/bootstrap';
import { HttpMethod } from '@core/http';
import { UriMatcherRefiner } from '../matcher-refiner';

describe('UriMatcherRefiner test', () => {
  it('should return origin with normal matcher', () => {
    const originMatcher: UriMatchers = {
      uri: '/test/a/b',
      type: HttpMethod.GET,
      payload: () => { },
    };
    const targetMatcher = UriMatcherRefiner.refine(originMatcher);
    expect(originMatcher).toBe(targetMatcher);
  });

  it('should return ParamUriMatchers with param matcher', () => {
    const originMatcher: UriMatchers = {
      uri: '/test/:argA/:argB',
      type: HttpMethod.GET,
      payload: () => { },
    };
    const targetMatcher: ParamUriMatchers = UriMatcherRefiner.refine(originMatcher) as ParamUriMatchers;
    expect(targetMatcher.uri).toBe('/test/:/:');
    expect(targetMatcher.params).toEqual(['argA', 'argB']);
  });
});
