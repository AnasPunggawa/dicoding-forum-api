const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository');

/**
 * @typedef {import('../database/postgres/pool')} Pool
 */

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  #pool;

  /**
   * @param {Pool} pool
   */
  constructor(pool) {
    super();
    this.#pool = pool;
  }

  /**
   * @param {string} token
   */
  async addToken(token) {
    const query = {
      text: `
        INSERT INTO
          authentications(token)
        VALUES
          ($1);
      `,
      values: [token],
    };

    await this.#pool.query(query);
  }

  /**
   * @param {string} token
   */
  async checkAvailabilityToken(token) {
    const query = {
      text: `
        SELECT
          *
        FROM
          authentications
        WHERE
          token = $1;
      `,
      values: [token],
    };

    const { rowCount } = await this.#pool.query(query);

    if (!rowCount) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.#pool.query(query);
  }
}

module.exports = AuthenticationRepositoryPostgres;
