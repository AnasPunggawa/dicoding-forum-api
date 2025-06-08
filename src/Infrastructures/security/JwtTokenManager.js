/* eslint-disable no-unused-vars */
const process = require('node:process');
const AuthenticationTokenManager = require('../../Applications/security/AuthenticationTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

/**
 * @typedef {import('@hapi/jwt').token} HapiJwtToken
 * @typedef {import('../../types/authentication.type').TokenPayloadType} TokenPayloadType
 * @typedef {import('../../types/authentication.type').DecodedPayloadType} DecodedPayloadType
 */

class JwtTokenManager extends AuthenticationTokenManager {
  #jwt;

  /**
   * @param {HapiJwtToken} jwt
   */
  constructor(jwt) {
    super();
    this.#jwt = jwt;
  }

  /**
   * @param {TokenPayloadType} payload
   * @returns {Promise<string>}
   */
  async createAccessToken(payload) {
    return this.#jwt.generate(payload, String(process.env.ACCESS_TOKEN_KEY));
  }

  /**
   * @param {TokenPayloadType} payload
   * @returns {Promise<string>}
   */
  async createRefreshToken(payload) {
    return this.#jwt.generate(payload, String(process.env.REFRESH_TOKEN_KEY));
  }

  /**
   * @param {string} token
   * @throws {InvariantError}
   */
  async verifyAccessToken(token) {
    try {
      const artifacts = this.#jwt.decode(token);

      this.#jwt.verify(artifacts, String(process.env.ACCESS_TOKEN_KEY));
    } catch (error) {
      throw new InvariantError('access token tidak valid');
    }
  }

  /**
   * @param {string} token
   * @throws {InvariantError}
   */
  async verifyRefreshToken(token) {
    try {
      const artifacts = this.#jwt.decode(token);

      this.#jwt.verify(artifacts, String(process.env.REFRESH_TOKEN_KEY));
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  /**
   * @param {string} token
   * @returns {Promise<DecodedPayloadType>}
   */
  async decodePayload(token) {
    const artifacts = this.#jwt.decode(token);

    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;
