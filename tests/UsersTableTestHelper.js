/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

/**
 * @typedef {import('../src/types/user.type').StoredUserType} StoredUserType
 */

const UsersTableTestHelper = {
  /**
   * @param {Partial<StoredUserType>} payload
   */
  async addUser({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: `
        INSERT INTO
          users(id, username, password, fullname)
        VALUES
          ($1, $2, $3, $4);
      `,
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  /**
   * @param {string} id
   * @returns {Promise<StoredUserType[]>}
   */
  async findUsersById(id) {
    const query = {
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          id = $1;
      `,
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
  },
};

module.exports = UsersTableTestHelper;
