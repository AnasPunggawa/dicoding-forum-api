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

describe('/threads/${threadId}/comments endpoints', () => {
  const ownerUserRequestPayload = {
    username: 'dicoding_1',
    password: 'secret',
    fullname: 'Dicoding Indonesia 1',
  };
  const notOwnerUserRequestPayload = {
    username: 'dicoding_2',
    password: 'secret',
    fullname: 'Dicoding Indonesia 2',
  };
  const threadRequestPayload = {
    title: 'Thread Title',
    body: 'Thread Body',
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

  describe('POST /threads/${threadId}/comments', () => {
    it('should response 201 and new comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'new comment thread',
      };
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 401 when add comment but user have not login', async () => {
      // Arrange
      const requestPayload = {
        content: 'new comment thread',
      };
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 401 when add comment but access token user has expired', async () => {
      // Arrange
      const requestPayload = {
        content: 'new comment thread',
      };
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
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
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${expiredAccessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when the thread is not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'new comment thread',
      };
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-not_exist_thread/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      // add use then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: ['new', 'thread', 'comment'],
      };
      const server = await createServer(container);

      // add use then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });
  });

  describe('DELETE /threads/$threadId}/comments/{commentId}', () => {
    it('should response 200 if soft delete comment success', async () => {
      // Assert
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // add comment
      const commentId = await CommentsTestHelper.addComment(
        server,
        accessToken,
        { threadId, content: 'new thread comment' }
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const deletedComment = await CommentsTableTestHelper.findCommentById(
        commentId
      );
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(deletedComment[0].isDeleted).toEqual(true);
    });

    it('should response 401 when delete comment but user have not login', async () => {
      // Assert
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // add comment
      const commentId = await CommentsTestHelper.addComment(
        server,
        accessToken,
        { threadId, content: 'new thread comment' }
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 401 when delete comment but access token user has expired', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // add comment
      const commentId = await CommentsTestHelper.addComment(
        server,
        accessToken,
        { threadId, content: 'new thread comment' }
      );

      // create expired access token
      const { id, username } = JwtToken.decode(accessToken).decoded.payload;
      const expiredAccessToken = JwtTestHelper.createExpiredAccessToken({
        id,
        username,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${expiredAccessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 403 when not owner try to delete then comment', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken: ownerAccessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );
      const { accessToken: notOwnerAccessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          notOwnerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        ownerAccessToken,
        threadRequestPayload
      );

      // add comment
      const commentId = await CommentsTestHelper.addComment(
        server,
        ownerAccessToken,
        { threadId, content: 'new thread comment' }
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${notOwnerAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda bukan pemilik comment ini');
    });

    it('should response 404 when the thread is not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-not_exist_thread/comments/comment-not_exist_comment',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when the comment is not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          ownerUserRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comment-not_exist_comment`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });
  });
});
