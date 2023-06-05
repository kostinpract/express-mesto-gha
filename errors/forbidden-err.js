exports.ForbiddenError = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
