const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      // @ts-ignore
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(
        payload,
        process.env.ACCESS_TOKEN_KEY
      );
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      // @ts-ignore
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(
        payload,
        process.env.REFRESH_TOKEN_KEY
      );
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyAccessToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        id: 'user-123',
        username: 'dicoding',
      });

      // Actions & Assert
      await expect(
        jwtTokenManager.verifyAccessToken(refreshToken)
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when access token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        id: 'user-123',
        username: 'dicoding',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyAccessToken(accessToken)
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        id: 'user-123',
        username: 'dicoding',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken)
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        id: 'user-123',
        username: 'dicoding',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken)
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        id: 'user-123',
        username: 'dicoding',
      });

      // Action
      const { username: expectedUsername, id: expectedUserId } =
        await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding');
      expect(expectedUserId).toEqual('user-123');
    });
  });
});
