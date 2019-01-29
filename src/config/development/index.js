import getEnv from '../utils';
import generalOptionalVariables from '../utils/optionalVariables';

// Define the required variables
const requiredVariables = [];
// Define optional environment variables and their defaults for development
const optionalVariables = {
  HOST: '127.0.0.1',
  SQL_DB_USER: 'postgres',
  SQL_DB_PASSWORD: 'postgres',
  SQL_DB_HOST: 'localhost',
  SQL_DB_NAME: 'shopinc_dev',
  ...generalOptionalVariables,
};

export default () => getEnv(requiredVariables, optionalVariables);
