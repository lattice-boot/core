import { IncomingMessage, ServerResponse } from 'http';
import { HttpMethod } from '@core/http';

export interface Matchers {
  ctx?: any;
  payload(req: IncomingMessage, res: ServerResponse): void | Promise<void>;
}

export interface UriMatchers extends Matchers {
  type: HttpMethod;
  uri: string;
}

export interface ParamUriMatchers extends UriMatchers {
  params: string[];
}
