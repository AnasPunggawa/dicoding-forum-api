const ThreadRepository = require('../ThreadRepository');

describe('ThreadsRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    // @ts-ignore
    await expect(threadRepository.addThread({})).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.getThreadById('')).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(threadRepository.verifyThreadExist('')).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
