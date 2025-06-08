const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    // @ts-ignore
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    // @ts-ignore
    await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    );
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    // @ts-ignore
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    // @ts-ignore
    await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };

    // creating dependency of use case
    const mockAuthenticationRepository = new AuthenticationRepository();

    // mocking
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // creating use case instance
    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
  });
});
