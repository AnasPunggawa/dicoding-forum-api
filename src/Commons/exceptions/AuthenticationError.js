const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 401);
  }
}

module.exports = AuthenticationError;
