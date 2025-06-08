const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const tokenManager = new AuthenticationTokenManager();

    // Action & Assert
    // @ts-ignore
    await expect(tokenManager.createAccessToken('')).rejects.toThrow(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );
    // @ts-ignore
    await expect(tokenManager.createRefreshToken('')).rejects.toThrow(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrow(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );
    await expect(tokenManager.verifyAccessToken('')).rejects.toThrow(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );
    await expect(tokenManager.decodePayload('')).rejects.toThrow(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );
  });
});
