const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 403);
  }
}

module.exports = AuthorizationError;
