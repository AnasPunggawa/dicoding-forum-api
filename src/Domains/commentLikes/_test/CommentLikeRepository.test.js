const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action & Assert
    await expect(
      commentLikeRepository.commentLikeToggle('', '')
    ).rejects.toThrow('COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
