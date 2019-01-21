/* eslint-disable global-require */
import testConfig from './test';
import developmentConfig from './development';
import stagingConfig from './staging';

const config = {};

switch (process.env.NODE_ENV) {
  case 'test':
    config.env = testConfig;
    break;
  case 'development':
    config.env = developmentConfig;
    break;
  case 'staging':
  default:
    config.env = stagingConfig;
}

export default config.env;
