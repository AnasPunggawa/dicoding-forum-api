/**
 * @typedef {import('./handler')} CommentsHandler
 * @typedef {import('../../../../types/hapi.type').HapiServerRouteType} HapiServerRouteType
 */

/**
 * @param {CommentsHandler} handler
 * @returns {HapiServerRouteType[]}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postCommentHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request, h) => handler.deleteCommentHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = routes;
