import { IncomingMessage, ServerResponse } from 'http';
import { Controller, Get, Post } from '@core/http';

@Controller('/hello')
export class HellowController {

  @Get('/world')
  helloworld(req: IncomingMessage, res: ServerResponse) {
    res.end('hello world');
  }

  @Get('/:world')
  param(req: IncomingMessage, res: ServerResponse) {
    res.end('hello world');
  }

}