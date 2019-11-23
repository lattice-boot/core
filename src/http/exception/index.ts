import { RequestListener } from 'http';
import { HttpStatus } from '../enum';

export class HttpExceptionRequestListener {
  static notFindListener: RequestListener = (req, res) => {
    res.statusCode = HttpStatus.NOT_FOUND;
    res.end('404 not find');
  };
}