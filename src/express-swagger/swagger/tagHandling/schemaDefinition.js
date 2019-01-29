import { EOL } from 'os';
import _ from 'lodash';
import * as strings from '../../../constants/strings';
import Utils from '../../../utils';
import { requireFromjsDoc, getConstructorNameOf } from '../../express-swagger-utils';

const addSchemaDescription = (description, schemaName, specs) => {
  const output = { ...specs };
  if (description) {
    if (description.includes(EOL)) {
      const [title, ...rest] = description.split(EOL);
      output.components.schemas[schemaName].title = title;
      output.components.schemas[schemaName].description = rest.join(EOL);
    } else {
      output.components.schemas[schemaName].description = description;
    }
  }
  return output;
};

const handleSchemaObjectDefinition = async (schemaName, schema, jsDoc, specs) => {
  let output = { ...specs };
  const { description } = jsDoc;
  output.components.schemas[schemaName] = {
    type: strings.swaggerTypes.object,
    properties: {},
    required: [],
  };
  await Utils.loopSequentially(Object.entries(schema), ([key, value]) => {
    output.components.schemas[schemaName].properties[key] = {};
    output.components.schemas[schemaName].properties[key].example = value;
    output.components.schemas[schemaName].properties[key].type = getConstructorNameOf(value);
  });

  const givenCustomTags = jsDoc.customTags.map(tagObject => tagObject.tag);
  const schemaValue = Object.values(schema);
  const schemaKeys = Object.keys(schema);
  if (givenCustomTags.includes(strings.swaggerSchemaRequiresAll)) {
    output.components.schemas[schemaName].required = schemaKeys;
  } else if (givenCustomTags.includes(strings.swaggerSchemaRequires)) {
    // Compute for the properties required
    await Utils.loopSequentially(jsDoc.customTags, async (tagObject) => {
      if (tagObject.tag === strings.swaggerSchemaRequires) {
        const { value } = tagObject;
        let requiredProperties = [value];
        // TODO Throw error if no property is provided
        if (!value) return;
        if (value.includes(EOL)) {
          requiredProperties = value.split(EOL);
        }
        await Utils.loopSequentially(requiredProperties, (property) => {
          if (schemaKeys.includes(property)) {
            output.components.schemas[schemaName].required.push(property);
          }
          // TODO Throw error if the given property does not match the any
          //  property in the given object
        });
      }
    });
  }
  output = addSchemaDescription(description, schemaName, output);
  return output;
};

export const handleSchemaDefinition = async (jsDoc, specs) => {
  const output = { ...specs };
  const schemaName = _.last(jsDoc.id.split('.'));
  const schema = requireFromjsDoc(jsDoc, schemaName);
  switch (getConstructorNameOf(schema)) {
    case strings.swaggerTypes.object:
      return handleSchemaObjectDefinition(schemaName, schema, jsDoc, output);
    default:
  }
  return output;
};

export const handlePureSchemaDefinition = async (jsDoc, specs) => {
  let output = { ...specs };
  const schemaName = _.last(jsDoc.id.split('.'));
  const { description } = jsDoc;
  const schema = requireFromjsDoc(jsDoc, schemaName);
  output.components.schemas[schemaName] = {};
  output = addSchemaDescription(description, schemaName, output);
  output.components.schemas[schemaName] = { ...output.components.schemas[schemaName], ...schema };
  return output;
};
