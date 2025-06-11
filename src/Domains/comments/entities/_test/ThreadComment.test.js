const ThreadComment = require('../ThreadComment');

describe('ThreadComment entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new ThreadComment(payload)).toThrow(
      'THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      username: [],
      date: {},
      content: false,
      likeCount: 'liked',
      isDeleted: 'telah dihapus',
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new ThreadComment(payload)).toThrow(
      'THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create ThreadComment entity correctly if the comment is not deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'thread comment',
      likeCount: 0,
      isDeleted: false,
    };

    // Action
    const threadComment = new ThreadComment(payload);

    // Assert
    expect(threadComment.id).toEqual(payload.id);
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.date).toEqual(payload.date);
    expect(threadComment.content).toEqual(payload.content);
    expect(threadComment.likeCount).toEqual(payload.likeCount);
  });

  it('should create ThreadComment entity correctly if the comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date().toISOString(),
      content: 'thread comment',
      likeCount: 0,
      isDeleted: true,
    };

    // Action
    const threadComment = new ThreadComment(payload);

    // Assert
    expect(threadComment.id).toEqual(payload.id);
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.date).toEqual(payload.date);
    expect(threadComment.content).toEqual('**komentar telah dihapus**');
    expect(threadComment.likeCount).toEqual(payload.likeCount);
  });
});
