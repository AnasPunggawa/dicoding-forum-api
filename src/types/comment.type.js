/**
 * @typedef {Object} NewCommentType
 * @property {string} threadId
 * @property {string} content
 */

/**
 * @typedef {Object} AddedCommentType
 * @property {string} id
 * @property {string} content
 * @property {string} owner
 */

/**
 * @typedef {Object} DeleteCommentType
 * @property {string} threadId
 * @property {string} commentId
 */

/**
 * @typedef {Object} RawThreadCommentType
 * @property {string} id
 * @property {string} username
 * @property {string} date
 * @property {string} content
 * @property {number} likeCount
 * @property {boolean} isDeleted
 */

/**
 * @typedef {Object} ThreadCommentType
 * @property {string} id
 * @property {string} username
 * @property {string} date
 * @property {string} content
 * @property {number} likeCount
 */

/**
 * @typedef {Object} StoredCommentType
 * @property {string} id
 * @property {string} content
 * @property {string} threadId
 * @property {string} owner
 * @property {string} date
 * @property {boolean} isDeleted
 */

module.exports = {};
