const JwtToken = require('@hapi/jwt').token;
const JwtTestHelper = require('../../../../tests/helpers/JwtTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationsTestHelper = require('../../../../tests/helpers/AuthenticationsTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadsTestHelper = require('../../../../tests/helpers/ThreadsTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentsTestHelper = require('../../../../tests/helpers/CommentsTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoints', () => {
  const userRequestPayload = {
    username: 'dicoding',
    password: 'secret',
    fullname: 'Dicoding Indonesia',
  };

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /threads', () => {
    it('should response 201 and new thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
        );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Assert
      const requestPayload = {
        title: 'Thread Title',
      };
      const server = await createServer(container);

      // register user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
        );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: ['Thread', 'Title'],
        body: 123,
      };
      const server = await createServer(container);

      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
        );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });

    it('should response 401 when user not login', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 401 when accessToken has expired', async () => {
      // Arrange
      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread Title',
      };
      const server = await createServer(container);

      // register user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
        );

      // create expired access token
      const { id, username } = JwtToken.decode(accessToken).decoded.payload;
      const expiredAccessToken = JwtTestHelper.createExpiredAccessToken({
        id,
        username,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${expiredAccessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });
  });

  describe('GET /threads', () => {
    it('should response 200 and get the detail thread', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(server, accessToken, {
        title: 'a thread title',
        body: 'a thread body',
      });

      // add comments
      for (let i = 0; i <= 1; i++) {
        await CommentsTestHelper.addComment(server, accessToken, {
          threadId,
          content: `a thread comment ${i + 1}`,
        });
      }

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.body).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].id).toBeDefined();
      expect(responseJson.data.thread.comments[0].username).toBeDefined();
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0].content).toBeDefined();
      expect(responseJson.data.thread.comments[0].likeCount).toBeDefined();
    });

    it('should response 404 when the thread is not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-not_exist_thread',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
