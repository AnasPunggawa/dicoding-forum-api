/**
 * @typedef {import('../../../types/thread.type').AddedThreadType} AddedThreadType
 */

class AddedThread {
  /**
   * @param {AddedThreadType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  /**
   * @param {AddedThreadType} payload
   */
  #verifyPayload(payload) {
    const requiredProps = ['id', 'title', 'owner'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.id !== 'string' ||
      typeof payload.title !== 'string' ||
      typeof payload.owner !== 'string'
    ) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;
