const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 404);
  }
}

module.exports = NotFoundError;
