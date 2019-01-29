import { EOL } from 'os';
import * as strings from '../../../constants/strings';
import Utils from '../../../utils';

const handleResponses = async (endpoint, method, jsDocTag, specs) => {
  const output = { ...specs };
  const { tag, value } = jsDocTag;
  output.paths[endpoint][method][tag] = {};

  const addResponse = async (res) => {
    let tagValues = res.split('-');
    tagValues = tagValues.map(tagValue => tagValue.trim());
    const [key, val, responseSchema] = tagValues;
    // TODO Throw error here if number is not provided as the first thing
    output.paths[endpoint][method][tag][key] = { description: val };

    if (responseSchema) {
      // The response schema was given so we link it in the description
      const { content } = output.paths[endpoint][method][tag][key];
      if (!content) {
        output.paths[endpoint][method][tag][key].content = {};
        output.paths[endpoint][method][tag][key].content[strings.JSONContentType] = {
          schema: { $ref: `#/components/schemas/${responseSchema}` },
        };
      } else {
        await Utils.loopSequentially(Object.keys(
          output.paths[endpoint][method][tag][key].content
        ), ((contentType) => {
          if (contentType === strings.JSONContentType) {
            output.paths[endpoint][method][tag][key].content[contentType] = {
              $ref: `#/components/schemas/${responseSchema}`,
              ...content[contentType]
            };
          }
        }));
      }
    }
  };

  if (value.includes(EOL)) {
    // Here we split the values at EOL to get an array of strings
    let values = value.split(EOL);
    values = values.map(v => v.trim());
    await Utils.loopSequentially(values, async (v) => {
      // Here v is a string for example, "200 - OK"
      await addResponse(v);
    });
  } else {
    // Here value is just one string without EOL example "200 - OK"
    await addResponse(value);
  }
  return output;
};

export default handleResponses;
