const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const useCasePayload = {
      title: 'Thread Title',
      body: 'Thread Body',
    };
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId,
    });

    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    // creating use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
      userId,
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: userId,
      })
    );
  });
});
