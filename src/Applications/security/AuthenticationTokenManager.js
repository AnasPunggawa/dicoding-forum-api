/* eslint-disable no-unused-vars */

/**
 * @typedef {import('../../types/authentication.type').TokenPayloadType} TokenPayloadType
 * @typedef {import('../../types/authentication.type').DecodedPayloadType} DecodedPayloadType
 */

class AuthenticationTokenManager {
  /**
   * @param {TokenPayloadType} payload
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async createRefreshToken(payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {TokenPayloadType} payload
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async createAccessToken(payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @throws {Error}
   */
  async verifyRefreshToken(token) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @throws {Error}
   */
  async verifyAccessToken(token) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} token
   * @return {Promise<DecodedPayloadType>}
   * @throws {Error}
   */
  async decodePayload(token) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationTokenManager;
