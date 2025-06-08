/**
 * @typedef {import('../../../types/thread.type').NewThreadType} NewThreadType
 */

class NewThread {
  /**
   * @param {NewThreadType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
  }

  /**
   * @param {NewThreadType} payload
   */
  #verifyPayload(payload) {
    const requiredProps = ['title', 'body'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (typeof payload.title !== 'string' || typeof payload.body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
