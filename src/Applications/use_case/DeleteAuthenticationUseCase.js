/**
 * @typedef {import('../../Domains/authentications/AuthenticationRepository')} AuthenticationRepository
 * @typedef {import('../../types/authentication.type').RefreshTokenPayloadType} RefreshTokenPayloadType
 */

class DeleteAuthenticationUseCase {
  #authenticationRepository;

  /**
   * @param {{ authenticationRepository: AuthenticationRepository }} dependencies
   */
  constructor({ authenticationRepository }) {
    this.#authenticationRepository = authenticationRepository;
  }

  /**
   * @param {RefreshTokenPayloadType} useCasePayload
   */
  async execute(useCasePayload) {
    this.#validatePayload(useCasePayload);

    await this.#authenticationRepository.checkAvailabilityToken(
      useCasePayload.refreshToken
    );

    await this.#authenticationRepository.deleteToken(
      useCasePayload.refreshToken
    );
  }

  /**
   * @param {RefreshTokenPayloadType} payload
   * @throws {Error}
   */
  #validatePayload(payload) {
    if (
      !Object.prototype.hasOwnProperty.call(payload, 'refreshToken') ||
      payload.refreshToken === undefined
    ) {
      throw new Error(
        'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
      );
    }

    if (typeof payload.refreshToken !== 'string') {
      throw new Error(
        'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteAuthenticationUseCase;
