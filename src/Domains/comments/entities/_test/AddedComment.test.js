const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Added Comment',
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new AddedComment(payload)).toThrow(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: ['comment', '-', 123],
      content: true,
      owner: 321,
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new AddedComment(payload)).toThrow(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });
  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Added Comment',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
