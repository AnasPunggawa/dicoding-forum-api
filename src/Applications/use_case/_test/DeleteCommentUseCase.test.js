const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if userId not meet data type specification', async () => {
    // Arrange
    const userId = 123;
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    // @ts-ignore
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(
      // @ts-ignore
      deleteCommentUseCase.execute(userId, useCasePayload)
    ).rejects.toThrow(
      'DELETE_COMMENT_USE_CASE.USER_ID_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      threadId: 'thread-123',
    };
    // @ts-ignore
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(() =>
      // @ts-ignore
      deleteCommentUseCase.execute(userId, useCasePayload)
    ).rejects.toThrow(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error if use case payload net meet data type specification', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      threadId: ['thread', 123],
      commentId: true,
    };
    // @ts-ignore
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Actions & Assert
    await expect(() =>
      // @ts-ignore
      deleteCommentUseCase.execute(userId, useCasePayload)
    ).rejects.toThrow(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking
    mockThreadRepository.verifyThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(userId, useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      userId,
      useCasePayload.commentId
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
  });
});
