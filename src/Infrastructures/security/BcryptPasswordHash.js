const EncryptionHelper = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

/**
 * @typedef {import('bcrypt')} Bcrypt
 */

class BcryptPasswordHash extends EncryptionHelper {
  #bcrypt;
  #saltRound;

  /**
   * @param {Bcrypt} bcrypt
   * @param {number} saltRound
   */
  constructor(bcrypt, saltRound = 10) {
    super();
    this.#bcrypt = bcrypt;
    this.#saltRound = saltRound;
  }

  /**
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    return this.#bcrypt.hash(password, this.#saltRound);
  }

  /**
   * @param {string} password
   * @param {string} hashedPassword
   * @throws {AuthenticationError}
   */
  async comparePassword(password, hashedPassword) {
    const result = await this.#bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

module.exports = BcryptPasswordHash;
