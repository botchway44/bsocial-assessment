const { rest } = require("msw");
const { setupServer } = require("msw/node");
const { gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

describe('Login', () => {
    it('It log in a user', async () => {

    });

})
