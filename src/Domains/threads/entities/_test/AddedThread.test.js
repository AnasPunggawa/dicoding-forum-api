const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Assert
    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new AddedThread(payload)).toThrow(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Assert
    const payload = {
      id: 123,
      title: true,
      owner: ['user', '-', '123'],
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new AddedThread(payload)).toThrow(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
      owner: 'user-321',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
