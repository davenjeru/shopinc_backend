import swaggerUI from 'swagger-ui-express';
import _ from 'lodash';
import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { EOL } from 'os';
import { HTTP404 } from '../../exceptions/HTTPExceptions';
import Utils from '../../utils';
import env from '../../config';
import * as strings from '../../constants/strings';
import { handlePureSchemaDefinition, handleSchemaDefinition } from './tagHandling/schemaDefinition';
import handleContentTypes from './tagHandling/consumes';
import handleExpects from './tagHandling/expects';
import handleResponses from './tagHandling/responses';
import handleSecurityTag from './tagHandling/security';

// TODO This function does not belong here, what the hell?
export const getHostURL = async basePath => new Promise((resolve, reject) => {
  if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test') {
    /* eslint-disable-next-line global-require */
    const dns = require('dns');
    dns.reverse(env.HOST, (err, hostnames) => {
      if (err) reject(err);
      resolve(`https://${hostnames[0]}`);
    });
  } else {
    resolve(`http://${env.HOST}:${env.PORT}${basePath}`);
  }
});

// List of all custom tags allowed.
const swaggerCustomTags = [
  strings.swaggerSchemaDefinition,
  strings.security,
  strings.summary,
  strings.expects,
  strings.responses,
  strings.produces,
  strings.consumes,
  strings.swaggerSchemaRequiresAll,
  strings.swaggerSchemaRequires,
  strings.pureSwaggerSchemaDefinition
];

const contentTypes = [
  strings.JSONContentType,
  strings.OctetStreamContentType,
];

const responses = {
  CSRFError: {},
  ExpiredSignatureError: {},
  FreshTokenRequired: {},
  InvalidHeaderError: {},
  InvalidTokenError: {},
  JWTDecodeError: {},
  MaskError: {
    description: 'When any error occurs on mask'
  },
  NoAuthorizationError: {},
  ParseError: {
    description: "When a mask can't be parsed"
  },
  RevokedTokenError: {},
  UserClaimsVerificationError: {},
  UserLoadError: {},
  WrongTokenError: {}
};

const swaggerController = blueprint => (req, res, next) => {
  const { url } = req;
  const case1 = url === '' || url === '/';
  const case2 = url.includes('swagger-ui') || url.includes('favicon');
  if (case1 || case2) {
    next();
  } else {
    throw new HTTP404(req, res, blueprint);
  }
};

const handleDescription = (endpoint, method, description, specs) => {
  const result = { ...specs };
  if (description) {
    result.paths[endpoint][method].description = description.split(EOL)
      .slice(1, description.split(EOL).length)
      .join(EOL);
    /* eslint-disable-next-line prefer-destructuring */
    result.paths[endpoint][method].summary = description.split(EOL)[0];
  } else {
    result.paths[endpoint][method].description = '';
    result.paths[endpoint][method].summary = '';
  }
  return result;
};

const handleCustomTags = async (endpoint, method, jsDocCustomTags, specs) => {
  const output = { ...specs };
  await Utils.loopSequentially(swaggerCustomTags, async (tag) => {
    await Utils.loopSequentially(jsDocCustomTags, async (jsDocTag) => {
      if (tag === jsDocTag.tag) {
        switch (tag) {
          case strings.security:
            return handleSecurityTag(endpoint, method, jsDocTag, output);
          case strings.produces:
          case strings.consumes:
            return handleContentTypes(endpoint, method, jsDocTag, output);
          case strings.expects:
            return handleExpects(endpoint, method, jsDocTag, output);
          case strings.responses:
            return handleResponses(endpoint, method, jsDocTag, output);
          default:
        }
      }
    });
  });
  return output;
};

const generateSpecsFromJSDocs = async (namespace, resource, specs) => {
  const jsdocCommand = path.resolve(__dirname, '../../../node_modules/.bin/jsdoc-parse');
  let output = { ...specs };
  const resourceEndpoint = `${namespace.basePath}${resource.basePath}`;
  output.paths[resourceEndpoint] = {};
  resource.definedMethods.forEach((method) => {
    output.paths[resourceEndpoint][method] = {
      responses: {},
      tags: [namespace.name],
    };
  });
  return new Promise((resolve, reject) => {
    exec(`${jsdocCommand} ${resource.filepath}`, async (err, stdout) => {
      if (err) reject(err);
      const jsDocArray = JSON.parse(stdout);
      await Utils.loopSequentially(jsDocArray, async (jsDoc) => {
        const { kind } = jsDoc;
        if (kind === 'constant') {
          const customTagsIntersection = _.intersection(swaggerCustomTags,
            jsDoc.customTags
              ? jsDoc.customTags.map(customTag => customTag.tag) : []);

          if (customTagsIntersection.length) {
            await Utils.loopSequentially(customTagsIntersection, async (tag) => {
              switch (tag) {
                case strings.swaggerSchemaDefinition:
                  // This is a schema being defined so we add it to components
                  output = await handleSchemaDefinition(jsDoc, output);
                  break;
                case strings.pureSwaggerSchemaDefinition:
                  output = await handlePureSchemaDefinition(jsDoc, output);
                  break;
                default:
              }
            });
          }
          return;
        }
        const method = jsDoc.name;
        if (!resource.definedMethods.includes(method)) return;
        output = handleDescription(resourceEndpoint, method, jsDoc.description, output);
        output = await handleCustomTags(resourceEndpoint, method, jsDoc.customTags, output);
      });
      return resolve(output);
    });
  });
};

const setUpSwagger = async (blueprint) => {
  const options = blueprint.settings.swagger;
  const url = await getHostURL(blueprint.basePath);
  let specs = {
    openapi: '3.0.0',
    info: options.swaggerDefinition.info,
    servers: [{ url }],
    paths: {},
    components: {
      responses,
      securitySchemes: options.swaggerDefinition.security,
      schemas: {}
    },
    security: [],
    tags: [],
  };

  await Utils.loopSequentially(blueprint.namespaces, async (namespace) => {
    specs.tags.push({
      name: namespace.name,
      description: namespace.settings.swagger.description || ''
    });
    await Utils.loopSequentially(namespace.resources, async (resource) => {
      specs = await generateSpecsFromJSDocs(namespace, resource, specs);
    });
  });

  fs.writeFileSync(
    path.resolve(__dirname, '../../../swagger.json'),
    JSON.stringify(specs, null, 2),
  );

  const swaggerRouter = Router();
  swaggerRouter.use(swaggerController(blueprint));
  swaggerRouter.use(swaggerUI.serve, swaggerUI.setup(specs));
  blueprint.router.use(blueprint.basePath, swaggerRouter);
};

export default setUpSwagger;
