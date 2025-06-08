/* eslint-disable no-unused-vars */

/**
 * @typedef {import('../../types/thread.type').NewThreadType} NewThreadType
 * @typedef {import('../../types/thread.type').AddedThreadType} AddedThreadType
 * @typedef {import('../../types/thread.type').ThreadDetailType} ThreadDetailType
 */

class ThreadRepository {
  /**
   * @param {string} userId
   * @param {NewThreadType} newThread
   * @returns {Promise<AddedThreadType>}
   * @throws {Error}
   */
  async addThread(userId, newThread) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} id
   * @returns {Promise<ThreadDetailType>}
   * @throws {Error}
   */
  async getThreadById(id) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /**
   * @param {string} id
   * @throws {Error}
   */
  async verifyThreadExist(id) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
