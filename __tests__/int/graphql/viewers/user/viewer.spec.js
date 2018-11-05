const chai = require('chai');
const { graphql } = require('graphql');
const keystone = require('keystone');

// const Candidate = keystone.list('Candidate').model;

const schema = require('../../../../../graphql/schema');

const { decodeToken } = require('../../../../../modelMethods/user');
const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const VIEWER_QUERY = `
{
  viewer {
    me {
      _id
      name
      username
      email
      isActivated
    }
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('viewer Query', () => {
  it('should be null when user is not logged in', async () => {
    await createRows.createUser();

    const query = VIEWER_QUERY;

    const rootValue = {};
    const context = getContext();
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.viewer).to.equal(null);
    expect(result.errors[0].extensions.code).to.equal('UNAUTHENTICATED');
  });

  it('should return the current user when user is logged in', async () => {
    const user = await createRows.createUser();
    const token = user.signToken();
    const jwtPayload = decodeToken(token);

    const query = VIEWER_QUERY;

    const rootValue = {};
    const context = getContext({ jwtPayload });
    const variables = {};

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.data.viewer.me._id).to.equal(`${user._id}`);
    expect(result.data.viewer.me.name).to.equal(user.name);
    expect(result.data.viewer.me.email).to.equal(user.email);
    // expect(result.data.viewer.me).to.exist;
    expect(result.errors).to.be.undefined;
  });
});
