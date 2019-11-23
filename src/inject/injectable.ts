import { ValueProvider, FactoryProvider } from './interface';
import { providerContainer } from './container';

export const PROVIDER_FACTORIES_TOKEN = '__provider_factories__';

export function registValue(provider: ValueProvider) {
  providerContainer.bind(provider.provide).toConstantValue(provider.useValue);
}

export function registFactory(provider: FactoryProvider) {
  providerContainer.bind(PROVIDER_FACTORIES_TOKEN).toConstantValue(provider);
}
