const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      threadId: threadId,
      owner: userId,
    });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('toggleCommentLike function', () => {
    it('should add comment like to database if user has not like the comment', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool
      );

      // Action
      await commentLikeRepositoryPostgres.toggleCommentLike(userId, commentId);

      // Assert
      const commentLikes = await CommentLikesTableTestHelper.findCommentLike(
        userId,
        commentId
      );
      expect(commentLikes).toHaveLength(1);
    });

    it('should remove comment like if user has liking the comment', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool
      );
      await CommentLikesTableTestHelper.addCommentLike(userId, commentId);

      // Action
      await commentLikeRepositoryPostgres.toggleCommentLike(userId, commentId);

      // Assert
      const commentLikes = await CommentLikesTableTestHelper.findCommentLike(
        userId,
        commentId
      );
      expect(commentLikes).toHaveLength(0);
    });
  });
});
