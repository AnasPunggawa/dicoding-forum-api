const pool = require('../../database/postgres/pool');
const JwtToken = require('@hapi/jwt').token;
const JwtTestHelper = require('../../../../tests/helpers/JwtTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationsTestHelper = require('../../../../tests/helpers/AuthenticationsTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadsTestHelper = require('../../../../tests/helpers/ThreadsTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentsTestHelper = require('../../../../tests/helpers/CommentsTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentLikesTestHelper = require('../../../../tests/helpers/CommentLikesTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoints', () => {
  const userRequestPayload = {
    username: 'dicoding',
    password: 'secret',
    fullname: 'Dicoding Indonesia',
  };
  const threadRequestPayload = {
    title: 'Thread Title',
    body: 'Thread Body',
  };

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when like a comment', async () => {
      // Assert
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
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
        { threadId, content: 'Thread Comment' }
      );

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const commentLikeCount =
        await CommentLikesTableTestHelper.getCommentLikeCount(commentId);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(commentLikeCount).toBe(1);
    });

    it('should response 200 when cancel like a comment', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
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
        { threadId, content: 'Thread Comment' }
      );

      // like comment
      await CommentLikesTestHelper.toggleLikeComment(
        server,
        accessToken,
        threadId,
        commentId
      );

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      const commentLikeCount =
        await CommentLikesTableTestHelper.getCommentLikeCount(commentId);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(commentLikeCount).toEqual(0);
    });

    it('should response 401 when like a comment but user has not login', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
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
        { threadId, content: 'Thread Comment' }
      );

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 401 when like a comment but access token user has expired', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
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
        { threadId, content: 'Thread Comment' }
      );

      // create expire access token
      const { id, username } = JwtToken.decode(accessToken).decoded.payload;
      const expiredAccessToken = JwtTestHelper.createExpiredAccessToken({
        id,
        username,
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${expiredAccessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when the thread is not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
        );

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-not_exist_thread/comments/comment-not_exist_comment/likes',
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

    it('should response 404 when comment is not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // add user then login
      const { accessToken } =
        await AuthenticationsTestHelper.registerAndLoginUser(
          server,
          userRequestPayload
        );

      // add thread
      const threadId = await ThreadsTestHelper.addThread(
        server,
        accessToken,
        threadRequestPayload
      );

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/comment-not_exist_comment/likes`,
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
