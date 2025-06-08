const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('../../../../types/hapi.type').HapiRequestType} HapiRequestType
 * @typedef {import('../../../../types/hapi.type').HapiResponseToolkitType} HapiResponseToolkitType
 * @typedef {import('../../../../types/hapi.type').HapiResponseObjectType} HapiResponseObjectType
 */

class ThreadHandler {
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
  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    /**
     * @type {AddThreadUseCase}
     */
    const addThreadUseCase = this.#container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(
      // @ts-ignore
      credentialId,
      request.payload
    );

    return h
      .response({
        status: 'success',
        data: {
          addedThread,
        },
      })
      .code(201);
  }

  /**
   * @param {HapiRequestType} request
   * @param {HapiResponseToolkitType} h
   * @returns {Promise<HapiResponseObjectType>}
   */
  async getThreadHandler(request, h) {
    /**
     * @type {GetDetailThreadUseCase}
     */
    const getDetailThreadUseCase = this.#container.getInstance(
      GetDetailThreadUseCase.name
    );
    const thread = await getDetailThreadUseCase.execute({
      threadId: request.params.threadId,
    });

    return h
      .response({
        status: 'success',
        data: {
          thread,
        },
      })
      .code(200);
  }
}

module.exports = ThreadHandler;
