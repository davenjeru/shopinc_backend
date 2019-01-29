import CustomException from '../index';

export default class VariableNotFound extends CustomException {
  constructor(variable) {
    super();
    this.message = `${variable} is required as an environment variable but it was not found!`;
  }
}
