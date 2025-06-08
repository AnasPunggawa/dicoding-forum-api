const routes = require('./routes');
const CommentsHandler = require('./handler');

/**
 * @typedef {import('../../../../Infrastructures/container')} Container;
 * @typedef {import('../../../../types/hapi.type').HapiPluginType} HapiPluginType
 * @typedef {import('../../../../types/hapi.type').HapiServerType} HapiServerType
 */

/**
 * @type {HapiPluginType}
 */
module.exports = {
  name: 'comments',
  version: '1.0.0',
  /**
   *
   * @param {HapiServerType} server
   * @param {{ container: Container }} dependenciesInjection
   */
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);

    server.route(routes(commentsHandler));
  },
};
