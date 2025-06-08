const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('../../../../types/hapi.type').HapiRequestType} HapiRequestType
 * @typedef {import('../../../../types/hapi.type').HapiResponseToolkitType} HapiResponseToolkitType
 * @typedef {import('../../../../types/hapi.type').HapiResponseObjectType} HapiResponseObjectType
 */

class CommentsHandler {
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
  async postCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;

    /**
     * @type {AddCommentUseCase}
     */
    const addCommentUseCase = this.#container.getInstance(
      AddCommentUseCase.name
    );

    // @ts-ignore
    const addedComment = await addCommentUseCase.execute(credentialId, {
      threadId,
      // @ts-ignore
      content: request.payload.content,
    });

    return h
      .response({
        status: 'success',
        data: {
          addedComment,
        },
      })
      .code(201);
  }

  /**
   * @param {HapiRequestType} request
   * @param {HapiResponseToolkitType} h
   * @returns {Promise<HapiResponseObjectType>}
   */
  async deleteCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    /**
     * @type {DeleteCommentUseCase}
     */
    const deleteCommentUseCase = this.#container.getInstance(
      DeleteCommentUseCase.name
    );

    // @ts-ignore
    await deleteCommentUseCase.execute(credentialId, { threadId, commentId });

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = CommentsHandler;
