/**
 * @typedef {import('./comment.type').ThreadCommentType} ThreadCommentType
 */

/**
 * @typedef {Object} NewThreadType
 * @property {string} title
 * @property {string} body
 */

/**
 * @typedef {Object} AddedThreadType
 * @property {string} id
 * @property {string} title
 * @property {string} owner
 */

/**
 * @typedef {Object} GetDetailThreadType
 * @property {string} threadId
 */

/**
 * @typedef {Object} ThreadDetailType
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string} date
 * @property {string} username
 */

/**
 * @typedef {Object} DetailThreadType
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string} date
 * @property {string} username
 * @property {ThreadCommentType[]} comments
 */

/**
 * @typedef {Object} StoredThreadType
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string} owner
 * @property {string} date
 * @property {boolean} is_deleted
 */

module.exports = {};
