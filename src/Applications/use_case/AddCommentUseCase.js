const NewComment = require('../../Domains/comments/entities/NewComment');

/**
 * @typedef {import('../../Domains/comments/CommentRepository')} CommentRepository
 * @typedef {import('../../Domains/threads/ThreadRepository')} ThreadRepository
 * @typedef {import('../../types/comment.type').NewCommentType} NewCommentType
 * @typedef {import('../../types/comment.type').AddedCommentType} AddedCommentType
 */

class AddCommentUseCase {
  #commentRepository;
  #threadRepository;

  /**
   * @param {{ commentRepository: CommentRepository, threadRepository: ThreadRepository }} dependencies
   */
  constructor({ commentRepository, threadRepository }) {
    this.#commentRepository = commentRepository;
    this.#threadRepository = threadRepository;
  }

  /**
   * @param {string} userId
   * @param {NewCommentType} useCasePayload
   * @returns {Promise<AddedCommentType>}
   */
  async execute(userId, useCasePayload) {
    await this.#threadRepository.verifyThreadExist(useCasePayload.threadId);

    const newComment = new NewComment(useCasePayload);

    const addedComment = this.#commentRepository.addComment(userId, newComment);

    return addedComment;
  }
}

module.exports = AddCommentUseCase;
