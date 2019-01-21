/* eslint-disable no-console */
import debug from 'debug';

const mainLogger = debug('ShopInc');
mainLogger.log = console.log.bind(console);

export const errorLogger = mainLogger.extend('Error');
errorLogger.log = console.error.bind(console);

export const warningLogger = mainLogger.extend('Warning');
warningLogger.log = console.warn.bind(console);

export const serverLogger = mainLogger.extend('Server');

export default mainLogger;
