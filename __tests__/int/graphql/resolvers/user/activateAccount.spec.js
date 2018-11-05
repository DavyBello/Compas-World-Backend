const chai = require('chai');
const { graphql } = require('graphql');

const schema = require('../../../../../graphql/schema');

// const { decodeToken } = require('../../../../modelMethods/user');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const USER_ACTIVATE_ACCOUNT_MUTATION = `
mutation M(
  $code: String!
) {
  userActivateAccount(input: {
    code: $code
  }) {
    token
    userType
    name
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('activateAccount Mutation', () => {
  it.only('should return an error if the token is invalid', async () => {
    const query = USER_ACTIVATE_ACCOUNT_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      code: '0818855561'
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userActivateAccount).to.equal(null);
    expect(result.errors[0].message).to.equal('JsonWebTokenError: jwt malformed');
  });

  it('should not login with wrong password', async () => {
    const user = await createRows.createCandidate();

    const query = USER_ACTIVATE_ACCOUNT_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      phone: user.phone,
      password: 'awesome',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userActivateAccount).to.equal(null);
    expect(result.errors[0].message).to.equal('invalid password');
  });

  it('should generate token when email and password is correct', async () => {
    const password = 'awesome';
    const user = await createRows.createCandidate({ password });

    const query = USER_ACTIVATE_ACCOUNT_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      phone: user.phone,
      password: 'awesome',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.userActivateAccount.name).to.equal(user.name);
    expect(result.data.userActivateAccount.token).to.exist;
    expect(result.errors).to.be.undefined;
  });
});
