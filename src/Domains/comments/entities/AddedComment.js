/**
 * @typedef {import('../../../types/comment.type').AddedCommentType} AddedCommentType
 */

class AddedComment {
  /**
   * @param {AddedCommentType} payload
   */
  constructor(payload) {
    this.#verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  /**
   * @param {AddedCommentType} payload
   * @throws {Error}
   */
  #verifyPayload(payload) {
    const requiredProps = ['id', 'content', 'owner'];

    for (const prop of requiredProps) {
      if (
        !Object.prototype.hasOwnProperty.call(payload, prop) ||
        payload[prop] === undefined
      ) {
        throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
    }

    if (
      typeof payload.id !== 'string' ||
      typeof payload.content !== 'string' ||
      typeof payload.owner !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
