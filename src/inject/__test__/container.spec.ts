import * as Container from '../container';

describe('DI container test', () => {
  it('should get root container with token by rootContainer', () => {
    const rootContainer = Container.rootContainer.get(Container.ROOT_CONTAINER);
    expect(rootContainer).toBe(Container.rootContainer);
  });

  it('should get provider container with token by rootContainer', () => {
    const providerContainer = Container.rootContainer.get(Container.PROVIDER_CONTAINER);
    expect(providerContainer).toBe(Container.providerContainer);
  });

  it('should get controller container with token by rootContainer', () => {
    const controllerContainer = Container.rootContainer.get(Container.CONTROLLER_CONTAINER);
    expect(controllerContainer).toBe(Container.controllerContainer);
  });

  it('should get root instance by provider container', () => {
    Container.rootContainer.bind('const_1').toConstantValue('provider is root child');
    const value = Container.providerContainer.get<string>('const_1');
    expect(value).toBe('provider is root child')
  });

  it('should get root instance by controller container', () => {
    Container.rootContainer.bind('const_2').toConstantValue('controller is root child');
    const value = Container.controllerContainer.get<string>('const_2');
    expect(value).toBe('controller is root child')
  });

  it('should get provider instance by controller container', () => {
    Container.providerContainer.bind('const_3').toConstantValue('controller is provider child');
    const value = Container.controllerContainer.get<string>('const_3');
    expect(value).toBe('controller is provider child')
  });

  it('should not get controller instance by provider container', () => {
    let value: string = '';
    Container.controllerContainer.bind('const_4').toConstantValue('controller is provider child');
    try {
      value = Container.providerContainer.get<string>('const_4');
    } catch{ }
    expect(value).toBe('')
  });
});
