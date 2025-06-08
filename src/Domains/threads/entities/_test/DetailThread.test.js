const DetailThread = require('../DetailThread');

describe('DetailThread entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      username: 'dicoding',
      comments: [],
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new DetailThread(payload)).toThrow(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      body: {},
      date: [],
      username: false,
      comments: 'banyak comment',
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new DetailThread(payload)).toThrow(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create DetailThread entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: new Date().toISOString(),
      username: 'dicoding',
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
