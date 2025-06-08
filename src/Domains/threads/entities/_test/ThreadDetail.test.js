const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread title',
      date: new Date().toISOString(),
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new ThreadDetail(payload)).toThrow(
      'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: [],
      title: true,
      body: 321,
      date: {},
      username: false,
    };

    // Action & Assert
    // @ts-ignore
    expect(() => new ThreadDetail(payload)).toThrow(
      'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create ThreadDetail entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a thread title',
      body: 'a thread body',
      date: new Date().toISOString(),
      username: 'dicoding',
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail).toBeInstanceOf(ThreadDetail);
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
  });
});
