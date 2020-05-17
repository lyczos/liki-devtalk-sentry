import { Environment } from './environment.type';

export const environment: Environment = {
  production: true,
  release: appProcess.env.APP_VERSION_SHA,
  name: 'production',
};
