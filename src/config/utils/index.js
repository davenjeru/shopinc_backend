import dotenv from 'dotenv';
import VariableNotFound from '../../exceptions/configExceptions';

dotenv.config();

export default (requiredVariables = [], optionalVariables = {}) => {
  requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new VariableNotFound(variable);
    }
  });

  Object.keys(optionalVariables)
    .forEach((variable) => {
      const value = process.env[variable];
      if (!value) {
        process.nextTick(() => {
          // Require on the next tick queue because it changes process.env
          // which will be needed by 'debug' while assigning namespaces
          /* eslint-disable global-require */
          const { warningLogger } = require('../../loggers');
          /* eslint-enable global-require */
          warningLogger(
            `${variable} was not found in env, defaulting to ${optionalVariables[variable]}.`
          );
        });
        process.env[variable] = optionalVariables[variable];
      }
    });
  return { ...process.env };
};
