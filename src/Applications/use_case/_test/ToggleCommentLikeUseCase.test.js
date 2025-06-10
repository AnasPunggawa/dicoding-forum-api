const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');

describe('ToggleCommentLikeUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
    };

    // Action
    // @ts-ignore
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({});

    // Assert
    await expect(
      // @ts-ignore
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      userId: ['user', 123],
      threadId: {},
      commentId: false,
    };

    // Action
    // @ts-ignore
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({});

    // Assert
    await expect(
      // @ts-ignore
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'TOGGLE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the toggle comment like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // creating dependency of use case
    const mockCommentLikeRepository = new CommentLikeRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking
    mockThreadRepository.verifyThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.toggleCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentLikeRepository.toggleCommentLike).toHaveBeenCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId
    );
  });
});
