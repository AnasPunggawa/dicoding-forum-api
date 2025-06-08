/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

/**
 * @typedef {import('../src/types/authentication.type').TokenType} TokenType
 */

class AuthenticationsTableTestHelper {
  /**
   * @param {string} token
   */
  static async addToken(token) {
    const query = {
      text: `
        INSERT INTO
          authentications(token)
        VALUES
          ($1);
      `,
      values: [token],
    };

    await pool.query(query);
  }

  /**
   * @param {string} token
   * @returns  {Promise<TokenType[]>}
   */
  static async findToken(token) {
    const query = {
      text: `
        SELECT
          token
        FROM
          authentications
        WHERE
          token = $1;
        `,
      values: [token],
    };

    const { rows } = await pool.query(query);

    return rows;
  }

  static async cleanTable() {
    await pool.query(
      'TRUNCATE TABLE authentications RESTART IDENTITY CASCADE;'
    );
  }
}

module.exports = AuthenticationsTableTestHelper;
