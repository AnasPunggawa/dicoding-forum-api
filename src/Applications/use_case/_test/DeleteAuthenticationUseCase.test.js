const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase');

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    // @ts-ignore
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    // Action & Assert
    await expect(
      // @ts-ignore
      deleteAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    );
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    // @ts-ignore
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

    // Action & Assert
    await expect(
      // @ts-ignore
      deleteAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrow(
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
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await deleteAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
  });
});
