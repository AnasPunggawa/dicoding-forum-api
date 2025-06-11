const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/ToggleCommentLikeUseCase');

/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('../../../../types/hapi.type').HapiRequestType} HapiRequestType
 * @typedef {import('../../../../types/hapi.type').HapiResponseToolkitType} HapiResponseToolkitType
 * @typedef {import('../../../../types/hapi.type').HapiResponseObjectType} HapiResponseObjectType
 */

class CommentLikesHandler {
  #container;

  /**
   * @param {Container} container
   */
  constructor(container) {
    this.#container = container;
  }

  /**
   * @param {HapiRequestType} request
   * @param {HapiResponseToolkitType} h
   * @returns {Promise<HapiResponseObjectType>}
   */
  async putCommentLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    /**
     * @type {ToggleCommentLikeUseCase}
     */
    const toggleCommentLikeUseCase = this.#container.getInstance(
      ToggleCommentLikeUseCase.name
    );

    await toggleCommentLikeUseCase.execute({
      userId: String(credentialId),
      threadId,
      commentId,
    });

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = CommentLikesHandler;
