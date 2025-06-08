/* eslint-disable no-unused-vars */

class AuthenticationRepository {
  /**
   * @param {string} token
   * @throws {Error}
   */
  async addToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @throws {Error}
   */
  async checkAvailabilityToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @throws {Error}
   */
  async deleteToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationRepository;
