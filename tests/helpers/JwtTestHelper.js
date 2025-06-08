/* istanbul ignore file */

const process = require('node:process');
const { token } = require('@hapi/jwt');

/**
 * @typedef {import('../../src/types/authentication.type').TokenPayloadType} TokenPayloadType
 */

class JwtTestHelper {
  /**
   * @param {TokenPayloadType} payload
   * @returns {string}
   */
  static createExpiredAccessToken({ id, username }) {
    return token.generate(
      { id, username },
      String(process.env.ACCESS_TOKEN_KEY),
      {
        ttlSec: -(Number(process.env.ACCESS_TOKEN_AGE) + 1),
      }
    );
  }
}

module.exports = JwtTestHelper;
