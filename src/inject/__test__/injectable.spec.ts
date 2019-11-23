import { registValue, registFactory, PROVIDER_FACTORIES_TOKEN, providerContainer } from '..';
import { FactoryProvider } from '../interface';

describe('Injectable test', () => {
  it('should bound const value with registValue(value)', () => {
    registValue({
      provide: 'test_token',
      useValue: '2333',
    });
    const boundValue = providerContainer.get('test_token');
    expect(boundValue).toBe('2333');
  });

  it('should bound factory with registFactory(factory)', async () => {
    registFactory({
      provide: 'test_token',
      useFactory: async () => '2333',
    });

    const boundFactories = providerContainer.getAll<FactoryProvider>(PROVIDER_FACTORIES_TOKEN);
    expect(await boundFactories[0].useFactory()).toBe('2333');
  });

  it('should bound multi factory with registFactory(factory)', () => {
    registFactory({
      provide: 'test_token',
      useFactory: async () => '2333',
    });
    registFactory({
      provide: 'test_token',
      useFactory: async () => '2333',
    });

    const boundFactories = providerContainer.getAll<FactoryProvider>(PROVIDER_FACTORIES_TOKEN);
    expect(boundFactories.length).not.toBeLessThan(1);
  });
});