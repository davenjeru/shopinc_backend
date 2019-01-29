import Namespace from '../../express-swagger/namespace';
import testResources from './resources';

const testRoute = new Namespace('test', '/test', [],
  { swagger: { description: 'The route for testing as the project is being set up.' } });

/* eslint-disable-next-line no-restricted-syntax */
for (const [, resource] of testResources.entries()) {
  testRoute.registerResource(resource);
}
export default testRoute;
