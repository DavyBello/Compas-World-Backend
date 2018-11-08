const keystone = require('keystone');
const chai = require('chai');
const { graphql } = require('graphql');
const { createRequest, createResponse } = require('node-mocks-http');

const User = keystone.list('User').model;

const mockedGoogleProfile = require('../../../../mocks/passport/profile/mockGoogleProfile')
const schema = require('../../../../../graphql/schema');

const {
  connectMongoose, clearDbAndRestartCounters, disconnectMongoose, createRows, getContext
} = require('../../../../helper');

const { expect } = chai;

// language=GraphQL
const AUTH_GOOGLE_MUTATION = `
mutation M($accessToken: String!) {
  authGoogle(input: { accessToken: $accessToken }) {
    token
    name
  }
}
`;

before(connectMongoose);

beforeEach(clearDbAndRestartCounters);

after(disconnectMongoose);

describe('loginWithGoogle Mutation', () => {
  it('should generate a token and create a user if the user does not exist in the database', async () => {
    const query = AUTH_GOOGLE_MUTATION;

    const rootValue = {};
    const context = {
      ...getContext(),
      req: createRequest(),
      res: createResponse(),
    };
    const variables = {
      accessToken: 'mockedGoogleAccessToken'
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).to.be.undefined;
    expect(result.data.authGoogle.name).to.equal(mockedGoogleProfile.displayName);
    expect(result.data.authGoogle.token).to.exist;
    
    const user = await User.findOne({ email: mockedGoogleProfile.emails[0].value });
    expect(result.data.authGoogle.name).to.equal(user.name);
  });
  
  it('should generate a token if user exists in the database', async () => {
    const user = await createRows.createUser({
      email: mockedGoogleProfile.emails[0].value,
      name: mockedGoogleProfile.displayName,
    });

    const query = AUTH_GOOGLE_MUTATION;

    const rootValue = {};
    const context = {
      ...getContext(),
      req: createRequest(),
      res: createResponse(),
    };
    const variables = {
      accessToken: 'mockedGoogleAccessToken'
    };

    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).to.be.undefined;
    expect(result.data.authGoogle.name).to.equal(user.name);
    expect(result.data.authGoogle.token).to.exist;
  });
});
