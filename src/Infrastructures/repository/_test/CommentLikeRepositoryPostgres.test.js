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
    it('should add a comment like to database when user has not liked the comment', async () => {
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

    it('should increase comment like count when a comment is liked', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool
      );

      // Action
      await commentLikeRepositoryPostgres.toggleCommentLike(userId, commentId);

      // Assert
      const likeCount = await CommentLikesTableTestHelper.getCommentLikeCount(
        commentId
      );
      expect(likeCount).toBe(1);
    });

    it('should remove a comment like from database when user has already liked the comment', async () => {
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

    it('should decrease comment like count when cancel liked a comment', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool
      );
      await CommentLikesTableTestHelper.addCommentLike(userId, commentId);

      // Action
      await commentLikeRepositoryPostgres.toggleCommentLike(userId, commentId);

      // Assert
      const likeCount = await CommentLikesTableTestHelper.getCommentLikeCount(
        commentId
      );
      expect(likeCount).toBe(0);
    });
  });
});
