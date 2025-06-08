const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message, 400);
  }
}

module.exports = InvariantError;
