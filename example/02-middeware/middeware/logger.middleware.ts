import { Middleware, OnFuncCheck, OnBeforeEnd, OnException, HttpStatus } from '@core/http';

@Middleware(/.*/)
export class LoggerMiddleware implements OnFuncCheck, OnBeforeEnd, OnException {

  check(req: import("http").IncomingMessage, res: import("http").ServerResponse) {
    console.log('before reequest');
  }

  beforeEnd(req: import("http").IncomingMessage, res: import("http").ServerResponse): Promise<void> {
    return new Promise((resolve, reject) => {
      res.setHeader("x-token", "23333");
      console.log('after reequest');
      resolve();
    })
  }

  catch(req: import("http").IncomingMessage, res: import("http").ServerResponse, error: any) {
    res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    res.end(error);
  }

}
