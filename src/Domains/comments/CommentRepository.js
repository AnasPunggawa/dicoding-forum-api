/* eslint-disable no-unused-vars */

/**
 * @typedef {import('../../types/comment.type').NewCommentType} NewCommentType
 * @typedef {import('../../types/comment.type').AddedCommentType} AddedCommentType
 * @typedef {import('../../types/comment.type').ThreadCommentType} ThreadCommentType
 */

class CommentRepository {
  /**
   * @param {string} userId
   * @param {NewCommentType} payload
   * @returns {Promise<AddedCommentType>}
   * @throws {Error}
   */
  async addComment(userId, payload) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} commentId
   * @throws {Error}
   */
  async deleteComment(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} threadId
   * @returns {Promise<ThreadCommentType[]>}
   * @throws {Error}
   */
  async getCommentsByThreadId(threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} commentId
   * @throws {Error}
   */
  async verifyCommentExist(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} userId
   * @param {string} commentId
   * @throws {Error}
   */
  async verifyCommentOwner(userId, commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
