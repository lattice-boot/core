import { RequestListener } from 'http';

export const LATTICE_LOADER = '__lat_loader__';

export abstract class LatticeLoader {
  abstract exec(): this;
  abstract getRequestListener(): RequestListener | null;
}
