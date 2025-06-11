/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

/**
 * @typedef {import('../src/types/commentLike.type').StoredCommentLikeType} StoredCommentLikeType
 */

class CommentLikesTableTestHelper {
  /**
   * @param {string} userId
   * @param {string} commentId
   */
  static async addCommentLike(userId, commentId) {
    const query = {
      text: `
        INSERT INTO
          comment_likes(user_id, comment_id)
        VALUES
          ($1, $2);
      `,
      values: [userId, commentId],
    };

    await pool.query(query);
  }

  /**
   * @param {string} userId
   * @param {string} commentId
   */
  static async removeCommentLike(userId, commentId) {
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

    await pool.query(query);
  }

  /**
   * @param {string} userId
   * @param {string} commentId
   * @returns {Promise<StoredCommentLikeType[]>}
   */
  static async findCommentLike(userId, commentId) {
    const query = {
      text: `
        SELECT
          *
        FROM
          comment_likes
        WHERE
          user_id = $1 AND
          comment_id = $2;
      `,
      values: [userId, commentId],
    };

    const { rows } = await pool.query(query);

    return rows;
  }

  /**
   * @param {string} commentId
   * @returns  {Promise<number>}
   */
  static async getCommentLikeCount(commentId) {
    const query = {
      text: `
        SELECT
          COUNT(user_id) AS "likeCount"
        FROM
          comment_likes
        WHERE
          comment_id = $1;
      `,
      values: [commentId],
    };

    const { rows } = await pool.query(query);

    return Number(rows[0].likeCount);
  }

  static async cleanTable() {
    await pool.query('TRUNCATE TABLE comment_likes RESTART IDENTITY CASCADE');
  }
}

module.exports = CommentLikesTableTestHelper;
