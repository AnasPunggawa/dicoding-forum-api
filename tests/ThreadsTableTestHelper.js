/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

/**
 * @typedef {import('../src/types/thread.type').StoredThreadType} StoredThreadType
 */

class ThreadsTableTestHelper {
  /**
   * @param {Partial<StoredThreadType>} payload
   */
  static async addThread({
    id = 'thread-123',
    title = 'Judul Thread',
    body = 'Body Thread',
    owner = 'user-123',
    date = new Date().toISOString(),
    is_deleted = false,
  }) {
    const query = {
      text: `
        INSERT INTO
          threads (id, title, body, owner, date, is_deleted)
        VALUES
          ($1, $2, $3, $4, $5, $6);
      `,
      values: [id, title, body, owner, date, is_deleted],
    };

    await pool.query(query);
  }

  /**
   * @param {string} id
   * @returns {Promise<StoredThreadType[]>}
   */
  static async findThreadById(id) {
    const query = {
      text: `
        SELECT
          *
        FROM
          threads
        WHERE
          id = $1;
      `,
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  }

  static async cleanTable() {
    await pool.query('TRUNCATE TABLE threads RESTART IDENTITY CASCADE');
  }
}

module.exports = ThreadsTableTestHelper;
