const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool.js');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  const owner = 'user-123';
  const ownerUsername = 'dicoding';
  const threadId = 'thread-123';
  const commentId = 'comment-123';

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: owner, username: ownerUsername });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        threadId,
        content: 'New Thread Comment',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(owner, newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        threadId,
        content: 'New Thread Comment',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        owner,
        newComment
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: commentId,
          content: newComment.content,
          owner,
        })
      );
    });
  });

  describe('deleteComment function', () => {
    it('should update is_deleted from database when soft delete the thread comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const deletedComment = await CommentsTableTestHelper.findCommentById(
        commentId
      );
      expect(deletedComment[0].isDeleted).toBe(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return empty array if the comments are not exist', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      const threadComments =
        await commentRepositoryPostgres.getCommentsByThreadId(
          'thread-do_not_have_comments'
        );
      //  & Assert
      expect(threadComments).toHaveLength(0);
    });

    it('should return array of comments if the comments of the thread are exist', async () => {
      // Arrange
      const commentDate = new Date().toISOString();
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'a new comment',
        threadId,
        owner,
        date: commentDate,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      const threadComments =
        await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(threadComments).toHaveLength(1);
      expect(threadComments[0].id).toBeDefined();
      expect(threadComments[0].id).toBe(commentId);
      expect(threadComments[0].username).toBeDefined();
      expect(threadComments[0].username).toBe(ownerUsername);
      expect(threadComments[0].date).toBeDefined();
      expect(threadComments[0].date).toBe(commentDate);
      expect(threadComments[0].content).toBeDefined();
      expect(threadComments[0].content).toBe('a new comment');
    });

    it('should return array of comments order by date ascending', async () => {
      // Arrange
      const commentsPayload = [
        {
          id: 'comment-123',
          threadId,
          owner,
          date: new Date().toISOString(),
        },
        {
          id: 'comment-234',
          threadId,
          owner,
          date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: 'comment-345',
          threadId,
          owner,
          date: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        },
      ];

      for (const commentPayload of commentsPayload) {
        await CommentsTableTestHelper.addComment({ ...commentPayload });
      }

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      const threadComments =
        await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(threadComments).toHaveLength(3);
      expect(threadComments[0].id).toBe(commentsPayload[1].id);
      expect(threadComments[1].id).toBe(commentsPayload[2].id);
      expect(threadComments[2].id).toBe(commentsPayload[0].id);
    });
  });

  describe('verifyCommentExist', () => {
    it('should throw NotFoundError if the comment is not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExist(
          'comment-not_exist_comment'
        )
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if the comment is exist', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExist(commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError if user is not the comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          'user-not_the_owner',
          commentId
        )
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if user is the comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(owner, commentId)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });
});
