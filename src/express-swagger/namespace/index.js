import { Router } from 'express';

export default class Namespace {
  constructor(name, basePath = '/', middleware = [], settings = {}) {
    this.name = name;
    this.basePath = basePath;
    this.settings = settings;
    this.resources = [];
    this.router = Router();
    for (let i = 0; i < middleware.length; i += 1) {
      this.router.use(basePath, middleware[i]);
    }
    this.settings.swagger = {
      name,
      basePath,
      ...this.settings.swagger
    };
    this.registerResource = this.registerResource.bind(this);
  }

  registerResource(resource) {
    const { basePath, router } = this;
    router.use(basePath, resource.router);
    this.resources.push(resource);
  }
}
