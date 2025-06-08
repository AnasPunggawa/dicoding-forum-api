const routes = require('./routes');
const AuthenticationsHandler = require('./handler');

/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('../../../../types/hapi.type').HapiPluginType} HapiPluginType
 * @typedef {import('../../../../types/hapi.type').HapiServerType} HapiServerType
 */

/**
 * @type {HapiPluginType}
 */
module.exports = {
  name: 'authentications',
  version: '1.0.0',

  /**
   * @param {HapiServerType} server
   * @param {{container: Container}} dependencyInjection
   */
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);

    server.route(routes(authenticationsHandler));
  },
};
