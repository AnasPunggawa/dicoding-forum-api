/**
 * @typedef {import('../../../types/thread.type').DetailThreadType} DetailThreadType
 */

class DetailThread {
  /**
   * @param {DetailThreadType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
    this.username = payload.username;
    this.comments = payload.comments;
  }

  /**
   * @param {DetailThreadType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = [
      'id',
      'title',
      'body',
      'date',
      'username',
      'comments',
    ];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.id !== 'string' ||
      typeof payload.title !== 'string' ||
      typeof payload.body !== 'string' ||
      typeof payload.date !== 'string' ||
      typeof payload.username !== 'string' ||
      !Array.isArray(payload.comments)
    ) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
