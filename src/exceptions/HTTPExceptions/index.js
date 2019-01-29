import URL, { URL as URLClass } from 'url';
import env from '../../config';
import CustomException from '../index';

const { NODE_ENV } = env;

class BaseHTTPException extends CustomException {
  constructor(res, code = 500, message = { error: 'Internal Server Error' }) {
    super();
    this.res = res;
    this.code = code;
    this.message = message.error;
    if (!this.res.finished) this.res.status(this.code).json(message);
  }
}

export class HTTP404 extends BaseHTTPException {
  constructor(req, res, blueprint = { basePath: '/' }) {
    const { protocol, hostname } = req;
    const { connection: { server } } = req;
    const { port } = server.address();
    const url = new URLClass(
      URL.format({
        protocol,
        hostname,
        pathname: blueprint.basePath,
        port: NODE_ENV === 'development' ? port : ''
      })
    );
    const message = {
      error: 'The requested resource was not found',
      links: [
        {
          apiDocumentation: url.toString()
        }
      ]
    };
    super(res, 404, message);
  }
}

export class HTTP405 extends BaseHTTPException {
  constructor(req, res) {
    const message = {
      error: 'Method Not Allowed',
    };
    super(res, 405, message);
  }
}

export default BaseHTTPException;
