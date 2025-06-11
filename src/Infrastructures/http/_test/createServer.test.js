const process = require('node:process');
const createServer = require('../createServer');

describe('HTTP server', () => {
  it('should use 0.0.0.0 HOST when NODE_ENV is production', async () => {
    // Arrange
    process.env.NODE_ENV = 'production';

    // Action
    // @ts-ignore
    const server = await createServer({});

    // Assert
    expect(server.info.host).toEqual('0.0.0.0');
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    // @ts-ignore
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    // @ts-ignore
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });
});
