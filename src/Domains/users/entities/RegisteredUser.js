/**
 * @typedef {import('../../../types/user.type').PublicUserType} PublicUserType
 */

class RegisteredUser {
  /**
   * @param {PublicUserType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    const { id, username, fullname } = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  /**
   * @param {PublicUserType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = ['id', 'username', 'fullname'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.id !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.fullname !== 'string'
    ) {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredUser;
