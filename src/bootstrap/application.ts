import { Server, createServer, RequestListener } from 'http';
import { Injectable, MultiInject, providerContainer } from '@core/inject';
import { LatticeLoader, LATTICE_LOADER } from '@core/context';
import { PROVIDER_FACTORIES_TOKEN } from '@core/inject/injectable';
import { FactoryProvider } from '@core/inject/interface';

@Injectable(Application, 'root')
export class Application {

  async run(port = 3000, hostname?: string) {
    await this.loadFactoryProvider();
    return this.constructListener().listen(port, hostname);
  }

  @MultiInject(LATTICE_LOADER)
  private controllerLoader!: LatticeLoader[];

  private serverInstance!: Server;

  private constructListener() {
    const listeners = this.controllerLoader.reduce<Array<RequestListener>>((target, loader) => {
      const listen = loader.exec().getRequestListener();
      listen && target.push(listen);
      return target;
    }, []);
    this.serverInstance = createServer((req, res) => {
      listeners.forEach(listener => listener(req, res));
    });
    return this;
  }

  private listen: (port: number, hostname?: string) => Promise<void> = async (...args: any[]) => {
    this.serverInstance.listen(...args, () => {
      console.log('opened server on', this.serverInstance.address());
    });
  };

  private async loadFactoryProvider() {
    const factoryProviders = this.factoryProviders;
    while (factoryProviders.length) {
      const provider = factoryProviders.pop() as FactoryProvider;
      try {
        const dependents: any[] = (provider.inject || []).map(token => providerContainer.get(token));
        const value = await provider.useFactory(...dependents);
        providerContainer.bind(provider.provide).toConstantValue(value);
      } catch (error) {
        if (!factoryProviders.length) throw error;
        factoryProviders.unshift(provider);
      }
    }
  }

  private get factoryProviders(): FactoryProvider[] {
    try {
      const factoryProviders = providerContainer.getAll<FactoryProvider>(PROVIDER_FACTORIES_TOKEN);
      providerContainer.unbind(PROVIDER_FACTORIES_TOKEN);
      return factoryProviders;
    } catch {
      return [];
    }
  }
}
