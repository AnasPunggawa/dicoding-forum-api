/* istanbul ignore file */

/**
 * @typedef {import('../../src/types/hapi.type').HapiServerType} HapiServerType
 * @typedef {import('../../src/types/comment.type').NewCommentType} NewCommentType
 */

class CommentsTestHelper {
  /**
   * @param {HapiServerType} server
   * @param {string} accessToken
   * @param {NewCommentType} payload
   * @returns {Promise<string>}
   */
  static async addComment(server, accessToken, { threadId, content }) {
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${threadId}/comments`,
      payload: {
        content,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    return JSON.parse(response.payload).data.addedComment.id;
  }
}

module.exports = CommentsTestHelper;
