/**
 * @typedef {import('./handler')} ThreadHandler
 * @typedef {import('../../../../types/hapi.type').HapiServerRouteType} HapiServerRouteType
 */

/**
 * @param {ThreadHandler} handler
 * @returns {HapiServerRouteType[]}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request, h) => handler.getThreadHandler(request, h),
  },
];

module.exports = routes;
