const chai = require('chai');
const { graphql } = require('graphql');

const schema = require('../../../../../graphql/schema');

const { decodeToken } = require('../../../../../modelMethods/user');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const CANDIDATE_IS_AUTHENTICATED_QUERY = `
{
  candidateIsAuthenticated
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe.skip('candidateIsAuthenticated Query', () => {
  it('should be false when user is not logged in', async () => {
    await createRows.createUser();

    const query = CANDIDATE_IS_AUTHENTICATED_QUERY;

    const rootValue = {};
    const context = getContext();
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.candidateIsAuthenticated).to.equal(false);
    expect(result.errors).to.be.undefined;
  });

  it('should be true when user is logged in', async () => {
    const user = await createRows.createUser();
    const token = user.signToken();
    const jwtPayload = decodeToken(token);

    const query = CANDIDATE_IS_AUTHENTICATED_QUERY;

    const rootValue = {};
    const context = getContext({ jwtPayload });
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.candidateIsAuthenticated).to.equal(true);
    expect(result.errors).to.be.undefined;
  });
});
