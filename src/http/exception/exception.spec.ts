import { HttpExceptionRequestListener } from '.';
import { HttpStatus } from '../enum';

describe('HttpExceptionRequestListener test', () => {
  describe('notFindListener test', () => {
    it('should return 404 code', () => {
      const req = {} as any, res = { end: (str: string) => { } } as any;
      HttpExceptionRequestListener.notFindListener(req, res);
      expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return "404 not find" massage', () => {
      let msgRecord = '';
      const req = {} as any, res = { end: (str: string) => msgRecord = str } as any;
      HttpExceptionRequestListener.notFindListener(req, res);
      expect(msgRecord).toBe('404 not find');
    });
  });
});
