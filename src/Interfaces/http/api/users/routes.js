/**
 * @typedef {import('./handler')} UsersHandler
 * @typedef {import('../../../../types/hapi.type').HapiServerRouteType} HapiServerRouteType
 */

/**
 * @param {UsersHandler} handler
 * @returns {HapiServerRouteType[]}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
  },
];

module.exports = routes;
