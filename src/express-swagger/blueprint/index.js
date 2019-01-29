import { Router } from 'express';

export default class Blueprint {
  constructor(name, basePath = '/', middleware = [], settings = {}) {
    this.basePath = basePath;
    this.settings = settings;
    this.namespaces = [];
    this.router = Router();
    for (let i = 0; i < middleware.length; i += 1) {
      this.router.use(middleware[i]);
    }
    this.registerNamespace = this.registerNamespace.bind(this);
  }

  registerNamespace(namespace) {
    const { router, basePath } = this;
    router.use(basePath, namespace.router);
    this.namespaces.push(namespace);
  }
}
