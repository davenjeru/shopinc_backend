export default class VariableNotFound extends Error {
  constructor(variable) {
    super();
    this.name = this.constructor.name;
    this.message = `${variable} is required as an environment variable but it was not found!`;
    Error.captureStackTrace(this, this.constructor);
  }
}
