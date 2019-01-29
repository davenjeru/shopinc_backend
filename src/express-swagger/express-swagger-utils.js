import path from 'path';

export const requireFromjsDoc = (jsDoc, namedExport) => {
  if (namedExport) {
    /* eslint-disable-next-line import/no-dynamic-require, global-require */
    return require(path.resolve(jsDoc.meta.path, jsDoc.meta.filename))[namedExport];
  }
  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  return require(path.resolve(jsDoc.meta.path, jsDoc.meta.filename));
};

export const getConstructorNameOf = instance => instance.constructor.name.toLowerCase();

export default null;
