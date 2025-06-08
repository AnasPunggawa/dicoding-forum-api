/**
 * @typedef {import('../../../types/user.type').NewUserType} NewUserType
 */

class RegisterUser {
  /**
   * @param {NewUserType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    const { username, password, fullname } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  /**
   * @param {NewUserType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = ['username', 'password', 'fullname'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.username !== 'string' ||
      typeof payload.password !== 'string' ||
      typeof payload.fullname !== 'string'
    ) {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (payload.username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (!payload.username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

module.exports = RegisterUser;
