const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  const owner = 'user-123';
  const ownerUsername = 'dicoding';

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: owner, username: ownerUsername });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(owner, newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        owner,
        newThread
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: newThread.title,
          owner: 'user-123',
        })
      );
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError if the thread is not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-not_exist_thread')
      ).rejects.toThrow(NotFoundError);
    });

    it('should return thread if the thread is exist', async () => {
      // Arrange
      const threadDate = new Date().toISOString();
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'a new thread',
        body: 'a thread body',
        date: threadDate,
        owner,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread.id).toBeDefined();
      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBeDefined();
      expect(thread.title).toBe('a new thread');
      expect(thread.body).toBeDefined();
      expect(thread.body).toBe('a thread body');
      expect(thread.date).toBeDefined();
      expect(thread.date).toBe(threadDate);
      expect(thread.username).toBeDefined();
      expect(thread.username).toBe(ownerUsername);
    });
  });

  describe('verifyThreadExist function', () => {
    it('should throw NotFoundError if the thread is not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExist('thread-not_exit_thread')
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if the thread is exist', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExist('thread-123')
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
