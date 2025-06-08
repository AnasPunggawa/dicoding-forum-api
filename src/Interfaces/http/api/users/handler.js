const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');

/**
 * @typedef {import('../../../../Infrastructures/container')} Container
 * @typedef {import('../../../../types/hapi.type').HapiRequestType} HapiRequestType
 * @typedef {import('../../../../types/hapi.type').HapiResponseToolkitType} HapiResponseToolkitType
 * @typedef {import('../../../../types/hapi.type').HapiResponseObjectType} HapiResponseObjectType
 */

class UsersHandler {
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
  async postUserHandler(request, h) {
    /**
     * @type {AddUserUseCase}
     */
    const addUserUseCase = this.#container.getInstance(AddUserUseCase.name);
    // @ts-ignore
    const addedUser = await addUserUseCase.execute(request.payload);

    return h
      .response({
        status: 'success',
        data: {
          addedUser,
        },
      })
      .code(201);
  }
}

module.exports = UsersHandler;
