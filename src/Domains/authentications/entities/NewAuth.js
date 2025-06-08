/**
 * @typedef {import('../../../types/authentication.type').AuthenticationTokenType} AuthenticationTokenType
 */

class NewAuth {
  /**
   * @param {AuthenticationTokenType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  /**
   * @param {AuthenticationTokenType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = ['accessToken', 'refreshToken'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.accessToken !== 'string' ||
      typeof payload.refreshToken !== 'string'
    ) {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewAuth;
