/* eslint-disable global-require */
import dotenv from 'dotenv';
import testConfig from './test';
import developmentConfig from './development';
import stagingConfig from './staging';
import VariableNotFound from '../exceptions/configExceptions';

dotenv.config();

const config = {};

// NODE_ENV will be needed for this switch statement, if not found then throw error
if (!process.env.NODE_ENV) {
  throw new VariableNotFound('NODE_ENV');
}
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

export default config.env();
