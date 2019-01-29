/**
 * @file The entry point of the ShopInc Backend application.
 * It gets the {@link module:app express application} and serves it after some conditions are met.
 * It also exits the process when there is an unhandled promise rejection
 * @see module:src/index
 * @name src/index.js
 * */

/** @module src/index */

import app from './app';
import env from './config';
import models from './database/models';
import { serverLogger } from './loggers';
import { getHostURL } from './express-swagger/swagger';

let server;

const { PORT, HOST } = env;

/**
 * Serve the application after some conditions are met.
 * The conditions may include a connection to the database.
 * @throws {SequelizeConnectionError} When the connection to the SQL database is unsuccessful.
 * @return {Promise<void>} A promise that resolves after the application
 * has successfully started.
 */
const serve = async () => {
  const listening = async () => {
    // Putting it on setImmediate because we will need the server object to be defined when
    // this function is called.
    // On the setImmediate queue, most nextTick/micro-tasks, expired timeouts and
    // IO callbacks will have been called
    setImmediate(async () => serverLogger(`Listening on ${await getHostURL('')}`));
  };
  // Try the DB connection, If it is successful, start the server
  await models.sequelize.authenticate();
  server = app.listen(PORT, HOST, listening);
};

process.once('unhandledRejection', (error) => {
  /* eslint-disable-next-line no-console */
  console.error(error);
  if (server) { server.close(); }
  process.exit(1);
});

// If this file was called via the CLI and not by being imported, serve the app
if (require.main === module) {
  serve();
}
