import { IncomingMessage, ServerResponse } from 'http';
import { Controller, Get } from '@core/http';

@Controller('/hello')
export class HellowController {

  @Get('/world')
  helloworld(req: IncomingMessage, res: ServerResponse) {
    res.end('hello world');
  }

  @Get('/async')
  param(req: IncomingMessage, res: ServerResponse) {
    return new Promise((resolve, rejcet) => {
      res.end('hello async');
      resolve();
    });
  }

  @Get('/throw')
  throw(req: IncomingMessage, res: ServerResponse) {
    return new Promise((resolve, rejcet) => {
      rejcet("wtf?");
    });
  }

}