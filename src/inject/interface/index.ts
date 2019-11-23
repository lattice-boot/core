interface BasicProvider {
  provide: any;
}

export interface FactoryProvider extends BasicProvider {
  useFactory: (...arg: any[]) => (Promise<any> | any),
  inject?: any[];
}

export interface ValueProvider extends BasicProvider {
  useValue: any;
}
