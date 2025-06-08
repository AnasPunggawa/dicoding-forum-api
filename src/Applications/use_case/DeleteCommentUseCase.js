/**
 * @typedef {import('../../Domains/comments/CommentRepository')} CommentRepository
 * @typedef {import('../../Domains/threads/ThreadRepository')} ThreadRepository
 * @typedef {import('../../types/comment.type').DeleteCommentType} DeleteCommentType
 */

class DeleteCommentUseCase {
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
   * @param {DeleteCommentType} useCasePayload
   */
  async execute(userId, useCasePayload) {
    if (typeof userId !== 'string') {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.USER_ID_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }

    this.#validatePayload(useCasePayload);

    await this.#threadRepository.verifyThreadExist(useCasePayload.threadId);

    await this.#commentRepository.verifyCommentExist(useCasePayload.commentId);

    await this.#commentRepository.verifyCommentOwner(
      userId,
      useCasePayload.commentId
    );

    await this.#commentRepository.deleteComment(useCasePayload.commentId);
  }

  /**
   * @param {DeleteCommentType} payload
   * @throws {Error}
   */
  #validatePayload(payload) {
    const requiredProps = ['threadId', 'commentId'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error(
          'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY'
        );
      }
    }

    if (
      typeof payload.threadId !== 'string' ||
      typeof payload.commentId !== 'string'
    ) {
      throw new Error(
        'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = DeleteCommentUseCase;
