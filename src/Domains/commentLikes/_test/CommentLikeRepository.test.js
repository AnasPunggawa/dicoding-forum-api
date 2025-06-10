const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action & Assert
    await expect(
      commentLikeRepository.toggleCommentLike('', '')
    ).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
