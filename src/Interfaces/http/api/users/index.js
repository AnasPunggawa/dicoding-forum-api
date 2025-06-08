const routes = require('./routes');
const UsersHandler = require('./handler');

/**
 * @typedef {import('../../../../types/hapi.type').HapiPluginType} HapiPluginType
 * @typedef {import('../../../../types/hapi.type').HapiServerType} HapiServerType
 * @typedef {import('../../../../Infrastructures/container')} Container
 */

/**
 * @type {HapiPluginType}
 */
module.exports = {
  name: 'users',
  version: '1.0.0',
  /**
   * @param {HapiServerType} server
   * @param {{container: Container}} dependencyInjection
   */
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);

    server.route(routes(usersHandler));
  },
};
