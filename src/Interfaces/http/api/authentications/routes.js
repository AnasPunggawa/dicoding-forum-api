/**
 * @typedef {import('./handler')} AuthenticationsHandler
 * @typedef {import('../../../../types/hapi.type').HapiServerRouteType} HapiServerRouteType
 */

/**
 *
 * @param {AuthenticationsHandler} handler
 * @returns {HapiServerRouteType[]}
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request, h) => handler.putAuthenticationHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
  },
];

module.exports = routes;
