import { EOL } from 'os';
import Utils from '../../../utils';

const handleSecurityTag = async (endpoint, method, jsDocTag, specs) => {
  const output = { ...specs };
  const { tag, value } = jsDocTag;
  output.paths[endpoint][method][tag] = [];

  if (value.includes(EOL)) {
    let values = jsDocTag.value.split(EOL);
    values = values.map(v => v.trim());
    await Utils.loopSequentially(values, (security) => {
      output.paths[endpoint][method][tag].push({ [security]: [] });
    });
  } else {
    output.paths[endpoint][method][tag].push({ [value]: [] });
  }
  return output;
};

export default handleSecurityTag;
