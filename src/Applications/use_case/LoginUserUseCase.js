const UserLogin = require('../../Domains/users/entities/UserLogin');
const NewAuthentication = require('../../Domains/authentications/entities/NewAuth');

/**
 * @typedef {import('../../Domains/users/UserRepository')} UserRepository
 * @typedef {import('../../Domains/authentications/AuthenticationRepository')} AuthenticationRepository
 * @typedef {import('../security/AuthenticationTokenManager')} AuthenticationTokenManager
 * @typedef {import('../security/PasswordHash')} PasswordHash
 * @typedef {import('../../types/authentication.type').UserLoginType} UserLoginType
 * @typedef {import('../../types/authentication.type').AuthenticationTokenType} AuthenticationTokenType
 */

class LoginUserUseCase {
  #userRepository;
  #authenticationRepository;
  #authenticationTokenManager;
  #passwordHash;

  /**
   * @param {{ userRepository: UserRepository, authenticationRepository: AuthenticationRepository, authenticationTokenManager: AuthenticationTokenManager, passwordHash: PasswordHash }} dependencies
   */
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this.#userRepository = userRepository;
    this.#authenticationRepository = authenticationRepository;
    this.#authenticationTokenManager = authenticationTokenManager;
    this.#passwordHash = passwordHash;
  }

  /**
   * @param {UserLoginType} useCasePayload
   * @returns {Promise<AuthenticationTokenType>}
   */
  async execute(useCasePayload) {
    const userLogin = new UserLogin(useCasePayload);

    const encryptedPassword = await this.#userRepository.getPasswordByUsername(
      userLogin.username
    );

    await this.#passwordHash.comparePassword(
      userLogin.password,
      encryptedPassword
    );

    const id = await this.#userRepository.getIdByUsername(userLogin.username);

    const accessToken =
      await this.#authenticationTokenManager.createAccessToken({
        username: userLogin.username,
        id,
      });
    const refreshToken =
      await this.#authenticationTokenManager.createRefreshToken({
        username: userLogin.username,
        id,
      });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    await this.#authenticationRepository.addToken(
      newAuthentication.refreshToken
    );

    return newAuthentication;
  }
}

module.exports = LoginUserUseCase;
