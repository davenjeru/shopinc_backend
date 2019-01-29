import getEnv from '../utils';
import generalOptionalVariables from '../utils/optionalVariables';

const optionalVariables = {
  HOST: 'localhost',
  SQL_DB_USER: 'postgres',
  SQL_DB_PASSWORD: 'postgres',
  SQL_DB_HOST: 'localhost',
  SQL_DB_NAME: 'shopinc_test',
  ...generalOptionalVariables,
};

export default () => getEnv([], optionalVariables);
