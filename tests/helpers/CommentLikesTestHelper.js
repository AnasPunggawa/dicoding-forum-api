/* istanbul ignore file */

/**
 * @typedef {import('../../src/types/hapi.type').HapiServerType} HapiServerType
 */

class CommentLikesTestHelper {
  /**
   *
   * @param {HapiServerType} server
   * @param {string} accessToken
   * @param {string} threadId
   * @param {string} commentId
   */
  static async toggleLikeComment(server, accessToken, threadId, commentId) {
    await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

module.exports = CommentLikesTestHelper;
