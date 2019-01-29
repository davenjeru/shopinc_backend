/**
 * @file The file that defines the base resource of the {@link module:testNamespace test namespace}
 * It also exits the process when there is an unhandled promise rejection
 * @name baseResource
 * @module baseResource
 * */


/* eslint-disable class-methods-use-this */
import Resource from '../../../express-swagger/resource';

/**
 * Test Schema
 * This should be given in the request body
 * @swagger-schema
 * @swagger-schema-requires
 * name
 * */
export const testingSchemaPOST = {
  name: 'Dave Mathews POST',
  greeting: 'Hello'
};

/**
 * PATCH Response Schema
 * This is what will be returned upon a successful patch request
 * @swagger-schema
 * */
export const testingSchemaPATCHResponse = {
  message: 'Hello, Dave Mathews!',
  name: 'Dave Mathews',
  greeting: ''
};

/**
 * GET Response Schema
 * This is what will be returned upon a successful get request
 * @swagger-schema
 */
export const testGETResponse = {
  message: 'Successfully tested this api...'
};

/** This is the resource that will be handled at the base path of its namespace.
 * The path is test/.
 * @name BaseResource
 * */
class BaseResource extends Resource {
  constructor(...args) {
    super(...args);
    BaseResource.get.bind(this);
    BaseResource.post.bind(this);
  }


  /**
   * Tests the application using GET
   * ## Used to test the application during the setup process
   *  - **This is a list item in bold**
   *  - _This is a list item in italics_
   *    - This is a list item inside of a another list item. Indent with 2 spaces
   *  1. This is a numbered list item
   * @responses
   *  200 - The test was successful - testGETResponse
   *  404 - The test was unsuccessful probably because the router was not set up properly.
   *  500 - The test was unsuccessful and I don't know why
   * @produces
   * application/json
   */
  static get(req, res) {
    res.json({ message: 'Successfully tested this api...' });
  }

  /**
   * Tests the application using POST
   * It shows how to use the "expects" keyword to give the schema that should be in the body
   * @security
   * Bearer
   * @responses
   *  200 - The test was successful.
   *  400 - Bad request.
   * @produces
   * application/json
   * @expects
   * testingSchemaPOST
   */
  static post(req, res) {
    const { body } = req;
    res.json({ message: `${body.greeting}, ${body.name}!` });
  }

  /**
   * Tests the application using PATCH
   * It shows how to use the "responses" keyword to give the schema that represents the response
   * body
   * @security
   * Bearer
   * @responses
   *  200 - The test was successful. - testingSchemaPATCHResponse
   *  400 - Bad request.
   * @produces
   * application/json
   * @expects
   * testingSchemaPOST
   */
  static patch(req, res) {
    const { body: { greeting, name } } = req;
    res.json({ message: `${greeting}, ${name}!`, name, greeting });
  }
}

const basePath = '';
const middleware = [];
const settings = {};

export default new BaseResource(basePath, middleware, settings, __filename, BaseResource);
