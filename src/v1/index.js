import bodyParser from 'body-parser';
import testNamespace from './testNamespace';
import jsDocNamespace from './jsDocNamespace';
import setupSwagger from '../express-swagger/swagger';
import Blueprint from '../express-swagger/blueprint';

// Namespaces related to version
const v1NameSpaces = [
  testNamespace,
  jsDocNamespace
];

const apiV1Prefix = '/api/v1';

const swagger = {
  swaggerDefinition: {
    info: {
      title: 'ShopInc Backend API',
      description: 'To be consumed by the ShopInc frontend application',
      version: '1.0.0',
    },
    security: {
      Bearer: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
  }
};

// Limit the body to 50mb
// Use json in the body
const middleware = [
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }),
  bodyParser.json()
];

const v1Blueprint = new Blueprint('ShopInc API V1', apiV1Prefix, middleware, { swagger });

// Register the v1 Namespaces
/* eslint-disable-next-line no-restricted-syntax */
for (const [, namespace] of v1NameSpaces.entries()) {
  v1Blueprint.registerNamespace(namespace);
}

// Register swagger to this blueprint
setupSwagger(v1Blueprint);

export default v1Blueprint;
