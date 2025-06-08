const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

/**
 * @typedef {import('../database/postgres/pool')} Pool
 * @typedef {import('../../types/thread.type').NewThreadType} NewThreadType
 * @typedef {import('../../types/thread.type').AddedThreadType} AddedThreadType
 * @typedef {import('../../types/thread.type').ThreadDetailType} ThreadDetailType
 */

class ThreadRepositoryPostgres extends ThreadRepository {
  #pool;
  #idGenerator;

  /**
   * @param {Pool} pool
   * @param {Function} idGenerator
   */
  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  /**
   * @param {string} userId
   * @param {NewThreadType} newThread
   * @returns {Promise<AddedThreadType>}
   * @throws {InvariantError}
   */
  async addThread(userId, newThread) {
    const { title, body } = newThread;
    const id = `thread-${this.#idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO
          threads(id, title, body, owner, date)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING
          id, title, owner;
      `,
      values: [id, title, body, userId, date],
    };

    const { rows } = await this.#pool.query(query);

    return new AddedThread({ ...rows[0] });
  }

  /**
   * @param {string} id
   * @returns {Promise<ThreadDetailType>}
   * @throws {NotFoundError}
   */
  async getThreadById(id) {
    const query = {
      text: `
        SELECT
          t.id, t.title, t.body, t.date, u.username
        FROM
          threads AS t
        INNER JOIN
          users AS u ON t.owner = u.id
        WHERE
          t.id = $1;
      `,
      values: [id],
    };

    const { rows, rowCount } = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new ThreadDetail({ ...rows[0], date: rows[0].date.toISOString() });
  }

  /**
   * @param {string} id
   * @throws {NotFoundError}
   */
  async verifyThreadExist(id) {
    const query = {
      text: `
        SELECT
          id
        FROM
          threads
        WHERE
          id = $1;
      `,
      values: [id],
    };

    const { rowCount } = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
