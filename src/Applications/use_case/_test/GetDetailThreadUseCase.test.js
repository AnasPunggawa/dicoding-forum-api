const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadComment = require('../../../Domains/comments/entities/ThreadComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};

    // Action
    // @ts-ignore
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Assert
    await expect(
      // @ts-ignore
      getDetailThreadUseCase.execute(useCasePayload)
    ).rejects.toThrow('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
    };

    // Action
    // @ts-ignore
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Assert
    await expect(
      // @ts-ignore
      getDetailThreadUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'GET_DETAIL_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the get detail thread action correctly if there are comments', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const mockThreadDetail = new ThreadDetail({
      id: useCasePayload.threadId,
      title: 'a thread title',
      body: 'a thread body',
      date: new Date().toISOString(),
      username: 'dicoding',
    });
    const mockRawComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: new Date().toISOString(),
        content: `a thread comment ${Date.now()}`,
        isDeleted: false,
      },
      {
        id: 'comment-213',
        username: 'johndoe',
        date: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
        content: `a thread comment ${Date.now()}`,
        isDeleted: true,
      },
      {
        id: 'comment-312',
        username: 'johndoe',
        date: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        content: `a thread comment ${Date.now()}`,
        isDeleted: true,
      },
    ];
    const mockComments = mockRawComments
      .map((comment) => new ThreadComment(comment))
      .sort((a, b) => a.date.localeCompare(b.date));
    const expectedDetailThread = new DetailThread({
      ...mockThreadDetail,
      comments: mockComments,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mocking
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    // creating use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(detailThread.comments[0]).toBeInstanceOf(ThreadComment);
    expect(detailThread.comments[1]).toBeInstanceOf(ThreadComment);
    expect(detailThread.comments[2]).toBeInstanceOf(ThreadComment);
    expect(detailThread.comments[0].id).toStrictEqual(mockRawComments[1].id);
    expect(detailThread.comments[1].id).toStrictEqual(mockRawComments[2].id);
    expect(detailThread.comments[2].id).toStrictEqual(mockRawComments[0].id);
  });
});
