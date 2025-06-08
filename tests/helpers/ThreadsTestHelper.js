/* istanbul ignore file */

/**
 * @typedef {import('../../src/types/hapi.type').HapiServerType} HapiServerType
 * @typedef {import('../../src/types/thread.type').NewThreadType} NewThreadType
 */

class ThreadTestHelper {
  /**
   * @param {HapiServerType} server
   * @param {string} accessToken
   * @param {NewThreadType} payload
   * @returns {Promise<string>}
   */
  static async addThread(server, accessToken, { title, body }) {
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title,
        body,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    return JSON.parse(response.payload).data.addedThread.id;
  }
}

module.exports = ThreadTestHelper;
