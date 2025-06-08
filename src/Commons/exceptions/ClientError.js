class ClientError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @throws {Error}
   */
  constructor(message, statusCode = 400) {
    if (new.target === ClientError) {
      throw new Error('cannot instantiate abstract class');
    }

    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

module.exports = ClientError;
