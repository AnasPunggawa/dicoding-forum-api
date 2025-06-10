/**
 * @typedef {import('../../Domains/commentLikes/CommentLikeRepository')} CommentLikeRepository
 * @typedef {import('../../Domains/threads/ThreadRepository')} ThreadRepository
 * @typedef {import('../../Domains/comments/CommentRepository')} CommentRepository
 * @typedef {import('../../types/commentLike.type').ToggleCommentLikeType} ToggleCommentLikeType
 */

class ToggleCommentLikeUseCase {
  #commentLikeRepository;
  #threadRepository;
  #commentRepository;

  /**
   * @param {{ commentLikeRepository: CommentLikeRepository, threadRepository: ThreadRepository, commentRepository: CommentRepository }} dependencies
   */
  constructor({ commentLikeRepository, threadRepository, commentRepository }) {
    this.#commentLikeRepository = commentLikeRepository;
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  /**
   * @param {ToggleCommentLikeType} useCasePayload
   */
  async execute(useCasePayload) {
    this.#verifyPayload(useCasePayload);

    await this.#threadRepository.verifyThreadExist(useCasePayload.threadId);

    await this.#commentRepository.verifyCommentExist(useCasePayload.commentId);

    await this.#commentLikeRepository.toggleCommentLike(
      useCasePayload.userId,
      useCasePayload.commentId
    );
  }

  /**
   * @param {ToggleCommentLikeType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = ['userId', 'threadId', 'commentId'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error(
          'TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY'
        );
      }
    }

    if (
      typeof payload.userId !== 'string' ||
      typeof payload.threadId !== 'string' ||
      typeof payload.commentId !== 'string'
    ) {
      throw new Error(
        'TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = ToggleCommentLikeUseCase;
