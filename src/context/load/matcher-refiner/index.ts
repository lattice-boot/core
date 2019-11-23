import { UriMatchers, ParamUriMatchers } from '@core/bootstrap';
import { UriUtils } from '@core/utils';

export class UriMatcherRefiner {

  static refine(matcher: UriMatchers): UriMatchers | ParamUriMatchers {
    if (matcher.uri.includes('/:')) {
      const uriArray = matcher.uri.split('/');
      let newMatch: ParamUriMatchers;
      matcher = newMatch = matcher as ParamUriMatchers;
      // construct newMatch
      newMatch.params = [];
      uriArray.forEach((v, i, a) => v[0] == ':' && newMatch.params.push(v.substring(1, v.length)));
      newMatch.uri = uriArray.reduce((uri, value) => value[0] == ':' ? UriUtils.join(uri, ':') : UriUtils.join(uri, value), '/');
    }
    return matcher;
  }
}
