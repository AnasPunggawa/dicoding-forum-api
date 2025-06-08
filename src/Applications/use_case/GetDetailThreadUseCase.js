const DetailThread = require('../../Domains/threads/entities/DetailThread');

/**
 * @typedef {import('../../Domains/threads/ThreadRepository')} ThreadRepository
 * @typedef {import('../../Domains/comments/CommentRepository')} CommentRepository
 * @typedef {import('../../types/thread.type').GetDetailThreadType} GetDetailThreadType
 * @typedef {import('../../types/thread.type').DetailThreadType} DetailThreadType
 */

class GetDetailThreadUseCase {
  #threadRepository;
  #commentRepository;

  /**
   * @param {{ threadRepository: ThreadRepository, commentRepository: CommentRepository }} dependencies
   */
  constructor({ threadRepository, commentRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  /**
   * @param {GetDetailThreadType} useCasePayload
   * @returns {Promise<DetailThreadType>}
   */
  async execute(useCasePayload) {
    this.#validatePayload(useCasePayload);

    const thread = await this.#threadRepository.getThreadById(
      useCasePayload.threadId
    );

    const comments = await this.#commentRepository.getCommentsByThreadId(
      useCasePayload.threadId
    );

    return new DetailThread({
      ...thread,
      comments,
    });
  }

  /**
   * @param {GetDetailThreadType} payload
   */
  #validatePayload(payload) {
    if (
      !Object.prototype.hasOwnProperty.call(payload, 'threadId') ||
      payload.threadId === undefined
    ) {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.threadId !== 'string') {
      throw new Error(
        'GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = GetDetailThreadUseCase;
