/**
 * @typedef {import('../../../types/comment.type').RawThreadCommentType} RawThreadCommentType
 */

class ThreadComment {
  /**
   * @param {RawThreadCommentType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.isDeleted
      ? '**komentar telah dihapus**'
      : payload.content;
    this.likeCount = payload.likeCount;
  }

  /**
   * @param {RawThreadCommentType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = [
      'id',
      'username',
      'date',
      'content',
      'likeCount',
      'isDeleted',
    ];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.id !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.date !== 'string' ||
      typeof payload.content !== 'string' ||
      typeof payload.likeCount !== 'number' ||
      typeof payload.isDeleted !== 'boolean'
    ) {
      throw new Error('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadComment;
