/* eslint-disable no-unused-vars */

/**
 * @typedef {import('../../types/user.type').NewUserType} NewUserType
 * @typedef {import('../../types/user.type').PublicUserType} PublicUserType
 */

class UserRepository {
  /**
   * @param {NewUserType} registerUser
   * @returns {Promise<PublicUserType>}
   * @throws {Error}
   */
  async addUser(registerUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @throws {Error}
   */
  async verifyAvailableUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async getPasswordByUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} username
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async getIdByUsername(username) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserRepository;
