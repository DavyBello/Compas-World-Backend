const chai = require('chai');
const { graphql } = require('graphql');
const { createRequest, createResponse } = require('node-mocks-http');

const schema = require('../../../../../graphql/schema');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const LOGIN_USER_MUTATION = `
mutation M(
  $email: String!,
  $password: String!
) {
  loginUser(input: {
    email: $email,
    password: $password
  }) {
    token
    name
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe.skip('loginWithEmailNoPassport Mutation', () => {
  it('should not login if email is not in the database', async () => {
    const query = LOGIN_USER_MUTATION;

    const rootValue = {};
    const context = { 
      ...getContext(),
      req: createRequest(),
      res: createResponse(),
    };
    const variables = {
      email: '0818855561',
      password: 'awesome',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.loginUser).to.equal(null);
    expect(result.errors[0].message).to.equal('invalid credentials');
  });

  it('should not login with wrong password', async () => {
    const user = await createRows.createUser({ password: 'notawesome' });

    const query = LOGIN_USER_MUTATION;

    const rootValue = {};
    const context = {
      ...getContext(),
      req: createRequest(),
      res: createResponse(),
    };
    const variables = {
      email: user.email,
      password: 'awesome',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.loginUser).to.equal(null);
    expect(result.errors[0].message).to.equal('invalid credentials');
  });

  it('should generate token when email and password is correct', async () => {
    const password = 'awesome';
    const user = await createRows.createUser({ password });

    const query = LOGIN_USER_MUTATION;

    const rootValue = {};
    const context = {
      ...getContext(),
      req: createRequest(),
      res: createResponse(),
    };
    const variables = {
      email: user.email,
      password,
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.loginUser.name).to.equal(user.name);
    expect(result.data.loginUser.token).to.exist;
    expect(result.errors).to.be.undefined;
  });
});
