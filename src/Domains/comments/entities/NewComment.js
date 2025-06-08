/**
 * @typedef {import('../../../types/comment.type').NewCommentType} NewCommentType
 */

class NewComment {
  /**
   * @param {NewCommentType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    this.content = payload.content;
    this.threadId = payload.threadId;
  }

  /**
   * @param {NewCommentType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = ['threadId', 'content'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.threadId !== 'string' ||
      typeof payload.content !== 'string'
    ) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;
