import getEnv from '../utils';

// Define the required variables
const requiredVariables = [];
// Define optional environment variables and their defaults for development
const optionalVariables = {
  DEBUG: 'ShopInc*',
  PORT: 8000,
  HOST: 'localhost',
};

export default () => getEnv(requiredVariables, optionalVariables);
