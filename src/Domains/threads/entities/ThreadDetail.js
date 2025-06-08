/**
 * @typedef {import('../../../types/thread.type').ThreadDetailType} ThreadDetailType
 */

class ThreadDetail {
  /**
   * @param {ThreadDetailType} payload
   */
  constructor(payload) {
    const requiredProps = ['id', 'title', 'body', 'date', 'username'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.id !== 'string' ||
      typeof payload.title !== 'string' ||
      typeof payload.body !== 'string' ||
      typeof payload.date !== 'string' ||
      typeof payload.username !== 'string'
    ) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
    this.username = payload.username;
  }
}

module.exports = ThreadDetail;
