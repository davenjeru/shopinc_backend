import Sequelize from 'sequelize';
import env from '../../config';
import { sqlLogger } from '../../loggers';

const {
  SQL_DB_USER,
  SQL_DB_NAME,
  SQL_DB_PASSWORD,
  SQL_DB_HOST,
  SQL_DB_PORT,
} = env;

/**
 * Determines the logging function to use when logging sequelize queries to stdout.
 * It depends on whether cli-highlight is installed for highlighting these said queries
 * but will still use sqlLogger.
 * @returns {function(*=)}
 */
const sequelizeLoggingFunction = () => {
  /* eslint-disable
  global-require, import/no-unresolved, import/no-extraneous-dependencies */
  try {
    const { highlight } = require('cli-highlight');
    return log => sqlLogger(highlight(log, {
      language: 'sql',
      ignoreIllegals: true
    }));
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      return log => sqlLogger(log);
    }
    throw e;
  }
  /* eslint-enable
  global-require, import/no-unresolved, import/no-extraneous-dependencies */
};
const defaultConfig = {
  dialect: 'postgres',
  username: SQL_DB_USER,
  password: SQL_DB_PASSWORD,
  database: SQL_DB_NAME,
  host: SQL_DB_HOST,
  port: SQL_DB_PORT,
  // Suppress the string based operators warning
  operatorsAliases: Sequelize.Op,
  logging: sequelizeLoggingFunction(),
};

module.exports = {
  development: {
    ...defaultConfig,
  },
  test: {
    ...defaultConfig,
  },
  staging: {
    ...defaultConfig,
  },
  production: {
    ...defaultConfig,
  },
};
