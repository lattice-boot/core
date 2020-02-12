import * as fs from 'fs';
import * as path from 'path';
import { rootContainer } from '@core/inject';
import { Application } from '.';

const relativePrefix = __dirname.substring(process.cwd().length, __dirname.length).split('').reduce((result, char) => {
  if (char == '/') result += '../';
  return result;
}, './');

export class EndpointScanner {
  private exclues: (string | RegExp)[] = ['node_modules'];

  createServer() {
    this.dfsImport('node_modules/@lattice', false);
    this.dfsImport(this.entrance);
    return rootContainer.get(Application);
  }

  import(src: string, hasCheckIgnore = false) {
    this.dfsImport(src, hasCheckIgnore);
    return this;
  }

  private constructor(
    private entrance: string,
    private regx: RegExp,
  ) { }

  private dfsImport(entrance: string, hasCheckIgnore = true) {
    const files = fs.readdirSync(entrance);
    files.map(file => {
      const filePath = path.join(entrance, file);
      if (hasCheckIgnore && this.checkIgnore(filePath)) return;
      let stats = fs.statSync(filePath);
      if (stats.isFile() && this.regx.test(filePath)) {
        this.require(filePath);
      }
      if (stats.isDirectory()) {
        this.dfsImport(filePath, hasCheckIgnore);
      }
    });
  }

  private checkIgnore(filePath: string) {
    for (const ignore of this.exclues) {
      if (ignore instanceof RegExp) {
        if (ignore.test(filePath))
          return true;
      } else {
        if (filePath.includes(ignore))
          return true;
      }
    }
    return false;
  }

  private require(filePath: string) {
    if (filePath.indexOf('node_modules/') == 0)
      filePath = filePath.replace(/node_modules\//, '');
    else if (filePath.indexOf('node_modules\\') == 0)
      filePath = filePath.replace(/node_modules\\/, '');
    else
      filePath = path.join(relativePrefix, filePath);
    require(filePath);
  }

  static with(path = '.', regx = new RegExp('.*\.(controller|middleware|service|provider)\.[js|ts]')) {
    return new this(path, regx);
  }

}
