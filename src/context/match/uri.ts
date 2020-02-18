import { Injectable } from '@core/inject';
import { UriMatchers } from '@core/bootstrap';
import { HttpMethod } from '@core/http';
import { UriUtils } from '@core/utils';
import { UriCtxMap } from './interface';

@Injectable(UriMatchersCtx, 'root')
export class UriMatchersCtx {
  private map: UriCtxMap = {};

  mount(uriMatchers: UriMatchers) {
    if (uriMatchers.uri.includes('/:'))
      this.mount2Tree(uriMatchers);
    else
      this.mount2Root(uriMatchers);

    console.log(`Mounted ${uriMatchers.uri}`)
  }

  get(uri: string, method: HttpMethod = HttpMethod.GET) {
    return (this.challengeUri(uri) || {})[method];
  }

  private challengeUri(uri: string) {
    uri = UriUtils.clean(uri);
    const queryChart = uri.indexOf('?');
    const path = queryChart == -1 ? uri : uri.substring(0, queryChart);
    let methodsMap = this.map[path];
    if (methodsMap) {
      // hit root
      return methodsMap;
    } else {
      // search tree
      let target: any = this.map;
      for (const child of path.split('/')) {
        if (!child) continue;
        target = target[child] ? target[child] : target[':'];
        if (!target) return null;
      }
      return target;
    }
  }

  private mount2Root(uriMatchers: UriMatchers) {
    this.map[uriMatchers.uri] = this.map[uriMatchers.uri] || {};
    this.map[uriMatchers.uri][uriMatchers.type] = uriMatchers;
  }

  private mount2Tree(uriMatchers: UriMatchers) {
    let target: any = this.map;
    uriMatchers.uri.split('/').forEach(v => {
      if (!v) return;
      target[v] = target[v] || {};
      target = target[v];
    });
    target[uriMatchers.type] = uriMatchers;
  }

}
