const NewThread = require('../../Domains/threads/entities/NewThread');

/**
 * @typedef {import('../../Domains/threads/ThreadRepository')} ThreadRepository
 * @typedef {import('../../types/thread.type').NewThreadType} NewThreadType
 * @typedef {import('../../types/thread.type').AddedThreadType} AddedThreadType
 */

class AddThreadUseCase {
  #threadRepository;

  /**
   * @param {{ threadRepository: ThreadRepository }} dependencies
   */
  constructor({ threadRepository }) {
    this.#threadRepository = threadRepository;
  }

  /**
   * @param {string} userId
   * @param {NewThreadType} useCasePayload
   * @returns  {Promise<AddedThreadType>}
   */
  async execute(userId, useCasePayload) {
    const newThread = new NewThread(useCasePayload);

    return this.#threadRepository.addThread(userId, newThread);
  }
}

module.exports = AddThreadUseCase;
