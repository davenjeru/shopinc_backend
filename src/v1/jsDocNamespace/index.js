import Namespace from '../../express-swagger/namespace';
import jsDocResources from './resources';
import Utils from '../../utils';

const settings = {
  swagger: { description: 'Everything JSDoc.' }
};
const jsDocNamespace = new Namespace('jsDoc', '/jsDoc', [], settings);
(async () => Utils.loopSequentially(jsDocResources, jsDocNamespace.registerResource))();

export default jsDocNamespace;
