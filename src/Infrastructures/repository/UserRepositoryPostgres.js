const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

/**
 * @typedef {import('../database/postgres/pool')} Pool
 * @typedef {import('../../Domains/users/entities/RegisterUser')} RegisterUser
 */

class UserRepositoryPostgres extends UserRepository {
  #pool;
  #idGenerator;

  /**
   *
   * @param {Pool} pool
   * @param {Function} idGenerator
   */
  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  /**
   * @param {string} username
   * @throws {Error}
   */
  async verifyAvailableUsername(username) {
    const query = {
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          username = $1;
      `,
      values: [username],
    };

    const { rowCount } = await this.#pool.query(query);

    if (rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  /**
   * @param {RegisterUser} registerUser
   * @returns {Promise<RegisteredUser>}
   */
  async addUser(registerUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this.#idGenerator()}`;

    const query = {
      text: `
        INSERT INTO
          users(id, username, password, fullname)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          id, username, fullname;
      `,
      values: [id, username, password, fullname],
    };

    const { rows } = await this.#pool.query(query);

    return new RegisteredUser({ ...rows[0] });
  }

  /**
   * @param {string} username
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async getPasswordByUsername(username) {
    const query = {
      text: `
        SELECT 
          password 
        FROM
          users
        WHERE
          username = $1;
      `,
      values: [username],
    };

    const { rows, rowCount } = await this.#pool.query(query);

    if (!rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return rows[0].password;
  }

  /**
   * @param {string} username
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async getIdByUsername(username) {
    const query = {
      text: `
        SELECT
          id
        FROM
          users
        WHERE
          username = $1;
      `,
      values: [username],
    };

    const { rows, rowCount } = await this.#pool.query(query);

    if (!rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = rows[0];

    return id;
  }
}

module.exports = UserRepositoryPostgres;
