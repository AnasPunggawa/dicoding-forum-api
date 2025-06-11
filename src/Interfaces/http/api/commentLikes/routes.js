/**
 * @typedef {import('./handler')} CommentLikesHandler
 * @typedef {import('../../../../types/hapi.type').HapiServerRouteType} HapiServerRouteType
 */

/**
 * @param {CommentLikesHandler} handler
 * @returns {HapiServerRouteType[]}
 */
const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (request, h) => handler.putCommentLikeHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = routes;
