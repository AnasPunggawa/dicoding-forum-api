/* istanbul ignore file */
/**
 * @typedef {import('../../src/types/hapi.type').HapiServerType} HapiServerType
 * @typedef {import('../../src/types/user.type').NewUserType} NewUserType
 * @typedef {import('../../src/types/authentication.type').AuthenticationTokenType} AuthenticationTokenType
 */

class AuthenticationsTestHelper {
  /**
   * @param {HapiServerType} server
   * @param {NewUserType} registerUserPayload
   * @returns {Promise<AuthenticationTokenType>}
   */
  static async registerAndLoginUser(server, { username, password, fullname }) {
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username,
        password,
        fullname,
      },
    });

    const responseUserLogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username,
        password,
      },
    });

    return JSON.parse(responseUserLogin.payload).data;
  }
}

module.exports = AuthenticationsTestHelper;
