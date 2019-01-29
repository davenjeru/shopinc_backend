/** @file This is where the application initialized */
/** @module app */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Writable } from 'stream';
import { StringDecoder } from 'string_decoder';
import env from '../config';
import v1Blueprint from '../v1';
import { serverLogger, errorLogger } from '../loggers';
import customErrorHandler from '../middleware/customErrorHandler';

/**
 * The express application.
 * @type {Express}
 */
const app = express();

const corsWhitelist = ['http://127.0.0.1:3000', 'http://localhost:3000', env.FRONTEND_HOST_URL];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (corsWhitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// Use Cross Origin Resource Sharing with the above configuration
app.use(cors(corsOptionsDelegate));

const decoder = new StringDecoder('utf-8');

// Morgan logging formats
const logAddr = { name: 'addr', field: ':remote-addr' };
const logUser = { name: 'user', field: ':remote-user' };
const logEndpoint = { name: 'endpoint', field: ':method :url HTTP/:http-version' };
const logStatus = { name: 'status', field: ':status :res[content-length]' };
const logReferrer = { name: 'referrer', field: ':referrer' };
const logResponseTime = { name: 'timing', field: ':response-time ms' };
const morganLoggingFormats = [
  logAddr, logUser, logEndpoint, logStatus, logReferrer, logResponseTime
];

const morganLogBuilder = (JSONLog) => {
  const returnLog = JSON.parse(`{${morganLoggingFormats.map(
    format => `"${format.name}": { "name": "${format.name}"}`
  ).join(',')}}`);
  Object.keys(returnLog).forEach((key) => { returnLog[key].value = JSONLog[key]; });
  return Object.keys(returnLog)
    .map(key => `${returnLog[key].name}: "${returnLog[key].value}"`).join(', ');
};


const morganWritable = new Writable({
  write: (chunk, encoding, callback) => {
    const JSONLog = JSON.parse(decoder.write(chunk));
    const resStatus = Number(JSONLog.status.slice(0, 3));
    if (resStatus >= 500) {
      errorLogger(morganLogBuilder(JSONLog));
    } else {
      serverLogger(morganLogBuilder(JSONLog));
    }
    callback();
  }
});

const morganFormat = morganLoggingFormats.map(
  format => `"${format.name}":"${format.field}"`
).join(',');
// set up logging with morgan
app.use(
  morgan(`{${morganFormat}}`, {
    stream: morganWritable
  })
);


// Use the V1 Blueprint
app.use(v1Blueprint.router);

// Error Handling middleware last
app.use(customErrorHandler);

/** Exports the {@link module:app~app Express application} having registered all middleware.
 * @type {Express}
 */
export default app;
