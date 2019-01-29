/* eslint-disable no-underscore-dangle */

import { Router } from 'express';
import { HTTP405 } from '../../exceptions/HTTPExceptions';

export default class Resource {
  constructor(basePath = '', middleware = [], settings = {}, filepath, subClass) {
    this._class = subClass;
    this.basePath = basePath;
    this.settings = settings || {};
    this.filepath = filepath;
    this.router = Router();
    for (let i = 0; i < middleware.length; i += 1) {
      this.router.use(basePath, middleware[i]);
    }

    if (!this.settings.allowedMethods) {
      this.settings.allowedMethods = [
        'get', 'post', 'patch',
        'delete', 'put',
        'options', 'head', 'trace',
        'connect', 'all', 'copy', 'link',
        'unlink', 'purge', 'lock', 'unlock',
        'propfind', 'view'
      ];
    }
    this.definedMethods = [];
    this.settings.allowedMethods.forEach((method) => {
      if (this._class[method]) {
        this.router[method](basePath, this._class[method]);
        this.definedMethods.push(method);
      }
    });

    this.router.use((req, res) => {
      let { method } = req;
      method = method.toLowerCase();
      const case1 = !this.definedMethods.includes(method);
      const case2 = method !== 'options';
      if (case1 && case2) throw new HTTP405(req, res);
    });
  }
}
