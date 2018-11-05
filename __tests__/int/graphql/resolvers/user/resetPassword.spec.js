const chai = require('chai');
const { graphql } = require('graphql');

const schema = require('../../../../../graphql/schema');

// const { decodeToken } = require('../../../../modelMethods/user');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const LOGIN_CANDIDATE_MUTATION = `
mutation M(
  $phone: String!,
  $password: String!
) {
  loginCandidate(input: {
    phone: $phone,
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

describe.skip('resetPassword Mutation', () => {
  it('should not login if phone is not in the database', async () => {
    const query = LOGIN_CANDIDATE_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      phone: '0818855561',
      password: 'awesome',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.loginCandidate).to.equal(null);
    expect(result.errors[0].message).to.equal('phone/user not found');
  });

  it('should not login with wrong password', async () => {
    const user = await createRows.createCandidate();

    const query = LOGIN_CANDIDATE_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      phone: user.phone,
      password: 'awesome',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.loginCandidate).to.equal(null);
    expect(result.errors[0].message).to.equal('invalid password');
  });

  it('should generate token when email and password is correct', async () => {
    const password = 'awesome';
    const user = await createRows.createCandidate({ password });

    const query = LOGIN_CANDIDATE_MUTATION;

    const rootValue = {};
    const context = getContext();
    const variables = {
      phone: user.phone,
      password: 'awesome',
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.loginCandidate.name).to.equal(user.name);
    expect(result.data.loginCandidate.token).to.exist;
    expect(result.errors).to.be.undefined;
  });
});
