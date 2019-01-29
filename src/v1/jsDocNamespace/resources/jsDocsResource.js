import path from 'path';
import express from 'express';
import Resource from '../../../express-swagger/resource';

const serveJSDoc = express.static(path.resolve(__dirname, '../../../../docs'));

class JsDocResource extends Resource {
  constructor(...args) {
    super(...args);
    JsDocResource.get.bind(this);
  }

  /**
   * The endpoint for viewing the code documentation
   * It only responds with HTML and can only be viewed by contributors to this project.
   * @responses
   *   200 - The JSDoc Homepage was successfully fetched
   * @produces
   * text/html
   * @security
   * Bearer
   */
  static get(req, res, next) {
    next(serveJSDoc(req, res, next));
  }
}

export default new JsDocResource('', [serveJSDoc], {}, __filename, JsDocResource);
