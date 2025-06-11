const process = require('node:process');
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const commentLikes = require('../../Interfaces/http/api/commentLikes');

/**
 * @typedef {import('../container')} Container
 */

/**
 * @param {Container} container
 * @returns
 */
async function createServer(container) {
  const server = Hapi.server({
    host:
      String(process.env.NODE_ENV) === 'production'
        ? String(process.env.HOST)
        : 'localhost',
    port: Number(process.env.PORT),
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(Jwt);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: String(process.env.ACCESS_TOKEN_KEY),
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: Number(process.env.ACCESS_TOKEN_AGE),
    },
    // eslint-disable-next-line no-unused-vars
    validate: (artifacts, request, h) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: commentLikes,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response);

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: translatedError.message,
          })
          .code(translatedError.statusCode);
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      return h
        .response({
          status: 'error',
          message: 'terjadi kegagalan pada server kami',
        })
        .code(500);
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  return server;
}

module.exports = createServer;
