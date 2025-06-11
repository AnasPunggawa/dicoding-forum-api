const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ThreadComment = require('../../Domains/comments/entities/ThreadComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

/**
 * @typedef {import('../database/postgres/pool')} Pool
 * @typedef {import('../../types/comment.type').NewCommentType} NewCommentType
 * @typedef {import('../../types/comment.type').AddedCommentType} AddedCommentType
 * @typedef {import('../../types/comment.type').ThreadCommentType} ThreadCommentType
 */

class CommentRepositoryPostgres extends CommentRepository {
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
   * @param {NewCommentType} payload
   * @returns {Promise<AddedCommentType>}
   */
  async addComment(userId, payload) {
    const { threadId, content } = payload;
    const id = `comment-${this.#idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO
          comments(id, content, thread_id, owner, date, is_deleted)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        RETURNING
          id, content, owner;
      `,
      values: [id, content, threadId, userId, date, false],
    };

    const { rows } = await this.#pool.query(query);

    return new AddedComment({ ...rows[0] });
  }

  /**
   * @param {string} commentId
   */
  async deleteComment(commentId) {
    const query = {
      text: `
        UPDATE
          comments
        SET
          is_deleted = true
        WHERE
          id = $1;
      `,
      values: [commentId],
    };

    await this.#pool.query(query);
  }

  /**
   * @param {string} threadId
   * @returns {Promise<ThreadCommentType[]>}
   * @throws {NotFoundError}
   */
  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT
          c.id,
          u.username,
          c.date,
          c.content,
          COUNT(cl.comment_id) AS "likeCount",
          c.is_deleted as "isDeleted"
        FROM
          comments AS c
        INNER JOIN
          users AS u ON c.owner = u.id
        LEFT JOIN
          comment_likes AS cl ON c.id = cl.comment_id
        WHERE
          c.thread_id = $1
        GROUP BY
          c.id,
          u.username,
          c.date,
          c.content,
          c.is_deleted
        ORDER BY
          c.date ASC;
      `,
      values: [threadId],
    };

    const { rows } = await this.#pool.query(query);

    return rows.map(
      (comment) =>
        new ThreadComment({
          ...comment,
          date: comment.date.toISOString(),
          likeCount: Number(comment.likeCount),
        })
    );
  }

  /**
   * @throws {NotFoundError}
   * @param {string} commentId
   */
  async verifyCommentExist(commentId) {
    const query = {
      text: `
        SELECT
          id
        FROM
          comments
        WHERE
          id = $1;
      `,
      values: [commentId],
    };

    const { rowCount } = await this.#pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  /**
   * @param {string} userId
   * @param {string} commentId
   * @throws {AuthorizationError}
   */
  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: `
        SELECT
          id
        FROM
          comments
        WHERE
          owner = $1 AND
          id = $2;
      `,
      values: [userId, commentId],
    };

    const { rowCount } = await this.#pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('anda bukan pemilik comment ini');
    }
  }
}

module.exports = CommentRepositoryPostgres;
