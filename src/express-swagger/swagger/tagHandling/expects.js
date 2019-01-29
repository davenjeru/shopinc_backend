import * as strings from '../../../constants/strings';

const handleExpects = (endpoint, method, jsDocTag, specs) => {
  // TODO Handle use of schema before definition
  const output = { ...specs };
  output.paths[endpoint][method].requestBody = {
    content: {
      [strings.JSONContentType]: {
        schema: {
          $ref: `#/components/schemas/${jsDocTag.value}`
        }
      }
    }
  };
  return output;
};

export default handleExpects;
