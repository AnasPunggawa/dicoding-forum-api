const RegisterUser = require('../../Domains/users/entities/RegisterUser');

/**
 * @typedef {import('../../Domains/users/UserRepository')} UserRepository
 * @typedef {import('../security/PasswordHash')} PasswordHash
 * @typedef {import('../../types/user.type').NewUserType} NewUserType
 * @typedef {import('../../types/user.type').PublicUserType} PublicUserType
 */

class AddUserUseCase {
  #userRepository;
  #passwordHash;

  /**
   * @param {{ userRepository: UserRepository, passwordHash: PasswordHash }} dependencies
   */
  constructor({ userRepository, passwordHash }) {
    this.#userRepository = userRepository;
    this.#passwordHash = passwordHash;
  }

  /**
   * @param {NewUserType} useCasePayload
   * @returns {Promise<PublicUserType>}
   */
  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);

    await this.#userRepository.verifyAvailableUsername(registerUser.username);

    registerUser.password = await this.#passwordHash.hash(
      registerUser.password
    );

    return this.#userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
