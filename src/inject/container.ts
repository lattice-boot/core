import { Container } from "inversify";

const ROOT_CONTAINER = '__root_container__';
const CONTROLLER_CONTAINER = '__controller_container__';
const PROVIDER_CONTAINER = '__provider_container__';

const rootContainer = new Container();

const providerContainer = new Container();
providerContainer.parent = rootContainer;

const controllerContainer = new Container();
controllerContainer.parent = providerContainer;

rootContainer.bind(ROOT_CONTAINER).toConstantValue(rootContainer);
rootContainer.bind(CONTROLLER_CONTAINER).toConstantValue(controllerContainer);
rootContainer.bind(PROVIDER_CONTAINER).toConstantValue(providerContainer);

export {
  rootContainer,
  controllerContainer,
  providerContainer,
  ROOT_CONTAINER,
  CONTROLLER_CONTAINER,
  PROVIDER_CONTAINER,
};
