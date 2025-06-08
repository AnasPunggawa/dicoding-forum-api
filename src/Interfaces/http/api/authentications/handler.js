const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/LogoutUserUseCase');

/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('../../../../types/hapi.type').HapiRequestType} HapiRequestType
 * @typedef {import('../../../../types/hapi.type').HapiResponseToolkitType} HapiResponseToolkitType
 * @typedef {import('../../../../types/hapi.type').HapiResponseObjectType} HapiResponseObjectType
 */

class AuthenticationsHandler {
  #container;

  /**
   * @param {Container} container
   */
  constructor(container) {
    this.#container = container;
  }

  /**
   * @param {HapiRequestType} request
   * @param {HapiResponseToolkitType} h
   * @returns {Promise<HapiResponseObjectType>}
   */
  async postAuthenticationHandler(request, h) {
    /**
     * @type {LoginUserUseCase}
     */
    const loginUserUseCase = this.#container.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(
      // @ts-ignore
      request.payload
    );

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      })
      .code(201);
  }

  /**
   * @param {HapiRequestType} request
   * @param {HapiResponseToolkitType} h
   * @returns {Promise<HapiResponseObjectType>}
   */
  async putAuthenticationHandler(request, h) {
    /**
     * @type {RefreshAuthenticationUseCase}
     */
    const refreshAuthenticationUseCase = this.#container.getInstance(
      RefreshAuthenticationUseCase.name
    );
    const accessToken = await refreshAuthenticationUseCase.execute(
      // @ts-ignore
      request.payload
    );

    return h
      .response({
        status: 'success',
        data: {
          accessToken,
        },
      })
      .code(200);
  }

  /**
   * @param {HapiRequestType} request
   * @param {HapiResponseToolkitType} h
   * @returns {Promise<HapiResponseObjectType>}
   */
  async deleteAuthenticationHandler(request, h) {
    /**
     * @type {LogoutUserUseCase}
     */
    const logoutUserUseCase = this.#container.getInstance(
      LogoutUserUseCase.name
    );

    // @ts-ignore
    await logoutUserUseCase.execute(request.payload);

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = AuthenticationsHandler;
