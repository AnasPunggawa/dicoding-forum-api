/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

/**
 * @typedef {import('../src/types/comment.type').StoredCommentType} StoredCommentType
 */

class CommentsTableTestHelper {
  /**
   * @param {Partial<StoredCommentType>} payload
   */
  static async addComment({
    id = 'comment-123',
    content = 'New Thread Comment',
    threadId,
    owner,
    date = new Date().toISOString(),
    isDeleted = false,
  }) {
    const query = {
      text: `
        INSERT INTO
          comments(id, content, thread_id, owner, date, is_deleted)
        VALUES 
          ($1, $2, $3, $4, $5, $6);
      `,
      values: [id, content, threadId, owner, new Date(date), isDeleted],
    };

    await pool.query(query);
  }

  /**
   * @param {string} id
   * @returns {Promise<StoredCommentType[]>}
   */
  static async findCommentById(id) {
    const query = {
      text: `
        SELECT 
          id, content, thread_id AS "threadId", owner, date, is_deleted AS "isDeleted"
        FROM
          comments
        WHERE
          id = $1;
      `,
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  }

  /**
   * @param {string} threadId
   * @returns {Promise<StoredCommentType[]>}
   */
  static async findCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT
          id, content, thread_id AS "threadId", owner, date, is_deleted AS "isDeleted"
        FROM
          comments
        WHERE
          thread_id = $1;
      `,
      values: [threadId],
    };

    const { rows } = await pool.query(query);

    return rows;
  }

  static async cleanTable() {
    await pool.query('TRUNCATE TABLE comments RESTART IDENTITY CASCADE');
  }
}

module.exports = CommentsTableTestHelper;
