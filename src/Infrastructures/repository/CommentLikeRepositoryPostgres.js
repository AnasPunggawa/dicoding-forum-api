const CommentLikeRepository = require('../../Domains/commentLikes/CommentLikeRepository');

/**
 * @typedef {import('../database/postgres/pool')} Pool
 */

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  #pool;

  /**
   * @param {Pool} pool
   */
  constructor(pool) {
    super();
    this.#pool = pool;
  }

  /**
   * @param {string} userId
   * @param {string} commentId
   */
  async toggleCommentLike(userId, commentId) {
    const isLiked = await this.#isCommentLiked(userId, commentId);

    if (isLiked) {
      await this.#removeCommentLike(userId, commentId);
    } else {
      await this.#addCommentLike(userId, commentId);
    }
  }

  /**
   * @param {string} userId
   * @param {string} commentId
   * @returns {Promise<boolean>}
   */
  async #isCommentLiked(userId, commentId) {
    const query = {
      text: `
        SELECT
          comment_id
        FROM
          comment_likes
        WHERE
          user_id = $1 AND
          comment_id = $2;
      `,
      values: [userId, commentId],
    };

    const { rowCount } = await this.#pool.query(query);

    return rowCount == 1;
  }

  /**
   * @param {string} userId
   * @param {string} commentId
   */
  async #addCommentLike(userId, commentId) {
    const query = {
      text: `
        INSERT INTO
          comment_likes(user_id, comment_id)
        VALUES
          ($1, $2);
      `,
      values: [userId, commentId],
    };

    await this.#pool.query(query);
  }

  /**
   * @param {string} userId
   * @param {string} commentId
   */
  async #removeCommentLike(userId, commentId) {
    const query = {
      text: `
        DELETE FROM
          comment_likes
        WHERE
          user_id = $1 AND
          comment_id = $2;
      `,
      values: [userId, commentId],
    };

    await this.#pool.query(query);
  }
}

module.exports = CommentLikeRepositoryPostgres;
