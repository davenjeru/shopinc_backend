import { EOL } from 'os';

const handleContentTypes = async (endpoint, method, jsDocTag, specs) => {
  const output = { ...specs };
  const { value } = jsDocTag;
  const { responses: declaredResponses } = output.paths[endpoint][method];
  const addToResponses = (contentType) => {
    Object.keys(declaredResponses).forEach((response) => {
      const { content } = output.paths[endpoint][method].responses[response];
      if (content) {
        output.paths[endpoint][method].responses[response].content = {
          [contentType]: {},
          ...content,
        };
      } else {
        output.paths[endpoint][method].responses[response].content = { [contentType]: {} };
      }
    });
  };
  if (value.includes(EOL)) {
    const givenContentTypes = value.split(EOL);
    givenContentTypes.forEach(addToResponses);
  } else {
    addToResponses(value);
  }
  return output;
};

export default handleContentTypes;
