import CustomException from '../exceptions';

export default (err, req, res, next) => {
  if (err) {
    if (!(err instanceof CustomException)) throw err;
  }
};
