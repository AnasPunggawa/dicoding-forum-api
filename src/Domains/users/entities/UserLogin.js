/**
 * @typedef {import('../../../types/authentication.type').UserLoginType} UserLoginType
 */

class UserLogin {
  /**
   * @param {UserLoginType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  /**
   * @param {UserLoginType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = ['username', 'password'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.username !== 'string' ||
      typeof payload.password !== 'string'
    ) {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UserLogin;
