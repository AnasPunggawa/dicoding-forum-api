/* eslint-disable no-unused-vars */

class PasswordHash {
  /**
   * @param {string} password
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async hash(password) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} plain
   * @param {string} encrypted
   * @throws {Error}
   */
  async comparePassword(plain, encrypted) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = PasswordHash;
