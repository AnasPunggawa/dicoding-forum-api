/**
 * @typedef {import('../../Domains/authentications/AuthenticationRepository')} AuthenticationRepository
 * @typedef {import('../security/AuthenticationTokenManager')} AuthenticationTokenManager
 * @typedef {import('../../types/authentication.type').RefreshTokenPayloadType} RefreshTokenPayloadType
 */

class RefreshAuthenticationUseCase {
  #authenticationRepository;
  #authenticationTokenManager;

  /**
   * @param {{ authenticationRepository: AuthenticationRepository, authenticationTokenManager: AuthenticationTokenManager }} dependencies
   */
  constructor({ authenticationRepository, authenticationTokenManager }) {
    this.#authenticationRepository = authenticationRepository;
    this.#authenticationTokenManager = authenticationTokenManager;
  }

  /**
   * @param {RefreshTokenPayloadType} useCasePayload
   * @returns {Promise<string>}
   */
  async execute(useCasePayload) {
    this.#verifyPayload(useCasePayload);

    await this.#authenticationTokenManager.verifyRefreshToken(
      useCasePayload.refreshToken
    );

    await this.#authenticationRepository.checkAvailabilityToken(
      useCasePayload.refreshToken
    );

    const { username, id } =
      await this.#authenticationTokenManager.decodePayload(
        useCasePayload.refreshToken
      );

    return this.#authenticationTokenManager.createAccessToken({ id, username });
  }

  /**
   * @param {RefreshTokenPayloadType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    if (
      !Object.prototype.hasOwnProperty.call(payload, 'refreshToken') ||
      payload.refreshToken === undefined
    ) {
      throw new Error(
        'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
      );
    }

    if (typeof payload.refreshToken !== 'string') {
      throw new Error(
        'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = RefreshAuthenticationUseCase;
