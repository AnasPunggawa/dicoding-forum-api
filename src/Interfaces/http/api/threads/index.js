const routes = require('./routes');
const ThreadHandler = require('./handler');

/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('../../../../types/hapi.type').HapiPluginType} HapiPluginType
 * @typedef {import('../../../../types/hapi.type').HapiServerType} HapiServerType
 */

/**
 * @type {HapiPluginType}
 */
module.exports = {
  name: 'threads',
  version: '1.0.0',
  /**
   * @param {HapiServerType} server
   * @param {{ container: Container}} param1
   */
  register: async (server, { container }) => {
    const threadHandler = new ThreadHandler(container);

    server.route(routes(threadHandler));
  },
};
